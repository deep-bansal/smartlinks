const express = require("express");
const db = require("./config/mongoose");
const neo4jdb = require("./config/neo4j");
const cookieParser = require("cookie-parser");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const port = process.env.PORT || 3000;
const passportGoogle = require("./config/passport-google-oauth");
const userRouter = require("./routes/api/v1/user");
db();
neo4jdb();

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// const corsOptions = {
// 	origin: "http://localhost:5173", // Allow this origin
// 	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
// 	credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// 	optionsSuccessStatus: 204, // For legacy browser support
// };
app.use(cors());
app.use(cookieParser());
app.use(express.json({ extended: false }));

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
	})
);
// app.use(express.static(`${__dirname}/public`));

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.setAuthenticatedUser);

app.use("/api/v1/user", userRouter);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
