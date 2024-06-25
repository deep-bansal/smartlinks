const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
	getAllUsers,
	createNewUser,
	getUser,
	updateUser,
	deleteUser,
} = require("../../../controllers/userController");

const {
	signup,
	login,
	protect,
	refreshSession,
	forgotPassword,
	resetPassword,
	signToken,
	signRefreshToken,
	setCookie,
} = require("../../../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.get("/refresh", refreshSession);

router.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/api/v1/user/login" }),
	(req, res) => {
		console.log("req.user", req.user);
		const token = signToken(user._id);
		token.refreshToken = signRefreshToken(user._id);
		setCookie(res, "refreshToken", token.refreshToken);
		setCookie(res, "accessToken", token.accessToken);
		res.status(200).json({
			status: "success",
			data: {
				user: req.user,
			},
		});
	}
);

router.route("/").get(getAllUsers).post(createNewUser);
router
	.route("/:id")
	.get(protect, getUser)
	.patch(protect, updateUser)
	.delete(protect, deleteUser);

module.exports = router;
