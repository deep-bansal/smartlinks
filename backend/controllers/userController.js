const mongoose = require("mongoose");
const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
	try {
		const user = await User.find().select("-__v");
		res.status(200).json({
			status: "success",
			count: user.length,
			data: {
				user,
			},
		});
	} catch (err) {
		console.error("****", err);
		res.status(400).json({
			status: "fail",
			message: "Unable to Fetch All Users",
		});
	}
};

exports.createNewUser = async (req, res) => {
	const { username, email } = req.body;
	try {
		const userPresent = await User.findOne({
			$or: [{ username: username }, { email: email }],
		});
		if (userPresent) {
			return res.status(400).json({
				status: "fail",
				message: "User already exists with this email or username",
			});
		}
		const user = await User.create(req.body);
		user.password = undefined;
		res.status(201).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (err) {
		console.error("****", err);
		res.status(500).json({
			status: "fail",
			message: "Unable to create User",
		});
	}
};

exports.getUser = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			return res
				.status(404)
				.json({ status: "Not found", message: "User not found with this ID" });
		}
		res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (err) {
		console.error("****", err);
		res.status(500).json({
			status: "fail",
			message: "Unable to Fetch User",
		});
	}
};

exports.updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (!user) {
			throw new Error("User not found with this ID", 404);
		}
		res.status(200).json({ status: "success", data: { user } });
	} catch (err) {
		console.error("****", err);
		res.status(500).json({
			status: "fail",
			message: "Unable to Update User",
		});
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		await User.findByIdAndDelete(id);
		res.status(204).json({ status: "suceess", data: null });
	} catch (err) {
		res.status(404).json({ status: "failed", message: err });
	}
};
