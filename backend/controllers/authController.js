const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

exports.signToken = (id) => {
	const accessToken = jwt.sign({ id: id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	return { accessToken };
};

exports.signRefreshToken = (id) => {
	return jwt.sign({ id: id }, process.env.JWT_REFRESH_SECRET, {
		expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE,
	});
};

exports.setCookie = (res, tokenName, token) => {
	res.cookie(tokenName, token, {
		httpOnly: true,
	});
};

exports.signup = async (req, res) => {
	const { username, email } = req.body;
	try {
		const userPresent = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});
		if (userPresent) {
			throw new Error("User already exists with this email or username", 400);
		}
		const user = await User.create(req.body);
		user.password = undefined;
		const token = exports.signToken(user._id);
		token.refreshToken = exports.signRefreshToken(user._id);
		exports.setCookie(res, "refreshToken", token.refreshToken);
		exports.setCookie(res, "accessToken", token.accessToken);
		res.status(201).json({
			status: "success",
			data: {
				user: user,
			},
		});
	} catch (err) {
		console.log("****", err);
		res.status(500).json({
			status: "fail",
			message: "Unable to signUp",
		});
	}
};

exports.login = async (req, res) => {
	const { username, password } = req.body;
	try {
		if (!username || !password) {
			throw new Error("Please provide valid credentials", 400);
		}
		const user = await User.findOne({
			$or: [{ username: username }, { email: username }],
		}).select("+password");

		if (!user || !(await user.correctPassword(password, user.password))) {
			throw new Error("Invalid ID or Password", 404);
		}
		const token = exports.signToken(user._id);
		token.refreshToken = exports.signRefreshToken(user._id);
		exports.setCookie(res, "refreshToken", token.refreshToken);
		exports.setCookie(res, "accessToken", token.accessToken);

		user.password = undefined;
		res.status(200).json({
			status: "success",
			data: {
				user: user,
			},
		});
	} catch (err) {
		console.log("****", err);
		res.status(500).json({
			status: "fail",
			message: "Unable to login",
		});
	}
};

exports.protect = async (req, res, next) => {
	let token;
	if (!req.cookies.accessToken) {
		return res.status(401).json({
			message: "No token found!",
		});
	}
	token = req.cookies.accessToken;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check if the user still exists
		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(401).json({
				message: "No user found with this token!",
			});
		}

		// Check if user changed password after the token was issued
		if (user.changePasswordAfter(decoded.iat)) {
			return res.status(401).json({
				message: "User recently changed password. Please log in again.",
			});
		}

		// Grant access to the protected route
		req.user = user;
		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({
				message: "Token expired! Please log in again.",
			});
		} else if (err.name === "JsonWebTokenError") {
			return res.status(401).json({
				message: "Invalid token! Please log in again.",
			});
		} else {
			console.log("****", err);
			return res.status(500).json({
				message: "Unable to authenticate! Please try again later.",
			});
		}
	}
};

exports.refreshSession = async (req, res) => {
	try {
		if (!req.cookies.refreshToken) {
			return res.status(401).json({
				message: "No refresh token found!",
			});
		}

		const decoded = jwt.verify(
			req.cookies.refreshToken,
			process.env.JWT_REFRESH_SECRET
		);

		if (!decoded) {
			return res.status(401).json({
				message: "Invalid refresh token!",
			});
		}

		const user = await User.findById(decoded.id);
		if (!user) {
			return res.status(401).json({
				message: "No user exists with this token!",
			});
		}

		const token = exports.signToken(user._id);
		res.cookie("accessToken", token.accessToken, {
			httpOnly: true,
		});

		res.status(200).json({
			status: "success",
			message: "Session refreshed",
		});
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({
				status: "fail",
				message: "Session expired. Please log in again.",
			});
		} else if (err.name === "JsonWebTokenError") {
			return res.status(401).json({
				status: "fail",
				message: "Session expired. Please log in again.",
			});
		} else {
			console.log("****", err);
			return res.status(500).json({
				status: "fail",
				message: "Unable to refresh session",
			});
		}
	}
};

exports.forgotPassword = async (req, res) => {
	try {
		if (!req.body.email) {
			return res.status(400).json({
				status: "fail",
				message: "Please provide email",
			});
		}
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				status: "fail",
				message: "User does not exist",
			});
		}
		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });
		const resetURL = `${req.protocol}://${req.get(
			"host"
		)}/api/v1/user/resetPassword/${resetToken}`;
		const message = `Forgot pwd click here ${resetURL}`;
		await sendEmail({
			email: user.email,
			subject: "Password Reset token for 10 mins",
			message,
		});
		res.status(200).json({
			status: "success",
			message: "Token sent to email",
		});
	} catch (err) {
		console.log(err);
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });
		return res.status(500).json({
			status: "fail",
			message: "There was error sending an email. Please Try again",
		});
	}
};

exports.resetPassword = async (req, res, next) => {
	//Get the user based on the token
	const hashtedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashtedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// If token has not expired, and there is a user, set new password
	if (!user) {
		return res.status(400).json({
			status: "fail",
			message: "No user exist or token is invalid or has expired",
		});
	}
	user.password = req.body.password;
	user.passwordResetExpires = undefined;
	user.passwordResetToken = undefined;
	await user.save();

	// Log the user in, send JWT
	const token = exports.signToken(user._id);
	token.refreshToken = exports.signRefreshToken(user._id);
	exports.setCookie(res, "refreshToken", token.refreshToken);
	exports.setCookie(res, "accessToken", token.accessToken);
	res.status(201).json({
		status: "success",
		message: "Password reset successful",
	});
};
