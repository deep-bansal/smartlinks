const mongoose = require("mongoose");
const articleSchema = new mongoose.Schema(
	{
		article_id: {
			type: String,
			required: true,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
