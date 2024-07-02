const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		likeable: {
			type: mongoose.Schema.ObjectId,
			require: true,
			refPath: "onModel",
		},
		onModel: {
			type: String,
			required: true,
			enum: ["ArticleMetadata", "Comment"],
		},
	},
	{
		timestamps: true,
	}
);

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
