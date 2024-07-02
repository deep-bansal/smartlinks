const mongoose = require("mongoose");
const analyticsSchema = new mongoose.Schema(
	{
		article_id: {
			type: String,
			required: true,
		},
		views: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ArticleViews",
		},
		edits: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
