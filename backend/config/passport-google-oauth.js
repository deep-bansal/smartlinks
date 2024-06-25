const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("../models/User");
const { generateFromEmail } = require("unique-username-generator");
const crypto = require("crypto");

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
			passReqToCallback: true,
		},
		async function (request, accessToken, refreshToken, profile, done) {
			try {
				const user = await User.findOne({ email: profile.email });
				if (user) {
					return done(null, user);
				}
				const pwd = crypto.randomBytes(16).toString("hex");
				const username = generateFromEmail(profile.email, 5);

				const newUser = await User.create({
					email: profile.email,
					password: pwd,
					username: username,
					profile: {
						first_name: profile.given_name,
						last_name: profile.family_name,
						avatar_url: profile.picture,
					},
				});

				return done(null, newUser);
			} catch (err) {
				console.log(err);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	console.log(user);
	done(null, user);
});

passport.deserializeUser(async function (id, done) {
	const user = await User.findById(id);
	if (!user) {
		return done(null, false);
	}
	done(null, user);
});

module.exports = passport;
