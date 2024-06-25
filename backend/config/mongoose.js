const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
let db = process.env.MONGO_URI;
db = db.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

const connectDB = async () => {
	try {
		await mongoose.connect(db);
		console.log("MongoDB connected...");
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = connectDB;
