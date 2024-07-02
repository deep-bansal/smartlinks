const mongoose = require("mongoose");
const articleViewsSchema = new mongoose.Schema(
	{
		article_id: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
const ArticleViews = mongoose.model("Article_Views", articleViewsSchema);
module.exports = ArticleViews;
