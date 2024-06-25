const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Please tell us your username"],
		},
		email: {
			type: String,
			required: [true, "Please tell us your email"],
			validate: [validator.isEmail],
		},
		password: {
			type: String,
			required: [true, "Please provide us your pasword"],
			minlength: 8,
			select: false,
		},
		profile: {
			first_name: {
				type: String,
				required: [true, "Please tell us your first name"],
			},
			last_name: {
				type: String,
				required: [true, "Please tell us your last name"],
			},
			bio: String,
			avatar_url: String,
			contributions: Number,
			preferences: {
				theme: { type: String, enum: ["light", "dark"], default: "light" },
			},
		},
		// role: {
		// 	type: String,
		// 	enum: ["admin", "user"],
		// 	default: "user",
		// },
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.pre("save", function (next) {
	if (!this.isModified("password") || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");

	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("User", userSchema);
