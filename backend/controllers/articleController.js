const mongoose = require("mongoose");
const User = require("../models/User");
const Article = require("../models/Article");
const ArticleViews = require("../models/ArticleViews");
const session = require("../config/neo4j");
const _ = require("lodash");
const queries = require("./query");
const {
	findRelatedArticlesByUserInput,
} = require("../elasticsearch/findRelatedArticlesByUserInp");

async function createIndexes() {
	try {
		await session.run("CREATE INDEX ON :Article(ranking);");
		await session.run("CREATE INDEX ON :Article(articleId);");
		await session.run("CREATE INDEX ON :Tag(name);");
		await session.run("CREATE INDEX ON :Category(name);");
		await session.run("CREATE INDEX ON :Author(authorId);");

		console.log("Indexes created successfully");
	} catch (error) {
		console.error("Error creating indexes:", error);
	} finally {
		await session.close();
	}
}

const getUserDetails = async (userId, firstname, lastname) => {
	try {
		if (userId) {
			const id = new mongoose.mongo.ObjectId(userId);
			const user = await User.findById(id).select(
				"profile.first_name profile.last_name avatar -_id"
			);
			return user;
		} else {
			const user = await User.findOne({
				"profile.first_name": firstname,
				"profile.last_name": lastname,
			}).select("profile.first_name profile.last_name avatar -_id");
			return user;
		}
	} catch (error) {
		console.error(`Error fetching user ${userId}:`, error);
		return null;
	}
};

const populateAuthorDetails = async (articles) => {
	const articlesWithDetails = await Promise.all(
		articles.map(async (article) => {
			const author = await getUserDetails(article.author, null, null);
			if (article.collaborators.length != 0) {
				const collaborators = await Promise.all(
					article.collaborators.map((collaboratorId) =>
						getUserDetails(collaboratorId, null, null)
					)
				);

				return { ...article, author, collaborators };
			}
			return { ...article, author };
		})
	);
	return articlesWithDetails;
};

exports.createArticle = async (req, res) => {
	const id = req.params.id;
	const { title, content, category, tags } = req.body;
	const { _id: authorId } = req.user;

	try {
		const authorIdStr = authorId.toString();
		const result = await session.run(queries.CREATE_ARTICLE_QUERY, {
			id,
			title,
			content,
			authorId: authorIdStr,
			category,
			tags,
		});

		const article = result.records[0].get("article");
		await Article.create({ article_id: id, author: req.user._id });
		res.status(201).json(article);
	} catch (error) {
		console.error("Error creating article:", error);
		res.status(500).json({ status: "fail", error: "Failed to create article" });
	}
};

exports.addRemoveCollaborator = async (req, res, action) => {
	const { id: articleId } = req.params;
	const { email } = req.body;
	const userId = req.user._id;

	try {
		const collaborator = await User.findOne({ email });
		if (!collaborator) {
			return res.status(404).json({ error: "Collaborator not found" });
		}

		const articleOwner = await Article.findOne({
			article_id: articleId,
			author: userId,
		});
		if (!articleOwner) {
			return res.status(403).json({
				status: "fail",
				error: `You are not allowed to ${
					action === "add" ? "add" : "remove"
				} contributor on this article`,
			});
		}

		const collaboratorId = collaborator._id.toString();
		let query = "";

		if (action === "add") {
			query = queries.ADD_COLLABORATOR;
		} else {
			query = queries.REMOVE_COLLABORATOR;
		}

		const result = await session.run(query, { articleId, collaboratorId });
		res.status(200).json({
			status: "success",
			message: `Collaborator ${
				action === "add" ? "added" : "removed"
			} successfully`,
		});
	} catch (err) {
		console.error(
			`Error ${action === "add" ? "adding" : "removing"} collaborator:`,
			err
		);
		res.status(500).json({
			status: "fail",
			error: `Failed to ${action === "add" ? "add" : "remove"} collaborator`,
		});
	}
};

exports.addCollaborator = async (req, res) => {
	exports.addRemoveCollaborator(req, res, "add");
};

exports.removeCollaborator = async (req, res) => {
	exports.addRemoveCollaborator(req, res, "remove");
};

exports.viewInEditMode = async (req, res) => {
	const { id: articleId } = req.params;
	const { _id: userId } = req.user;

	try {
		const userIdStr = userId.toString();
		const result = await session.run(queries.EDIT_MODE, {
			articleId,
			userId: userIdStr,
		});

		if (result.records.length === 0) {
			return res.status(403).json({
				status: "fail",
				error: "You are neither author nor contributor of this article",
			});
		}

		const article = result.records[0].get("article");
		res.status(200).json({ status: "success", data: { article } });
	} catch (err) {
		console.error("Error viewing article in edit mode:", err);
		res.status(500).json({ status: "fail", error: "Internal Server Error" });
	}
};

exports.getArticlesByCategory = async (req, res) => {
	const { category } = req.query;
	try {
		const result = await session.run(queries.GET_ARTICLES_BY_CATEGORY, {
			category,
		});

		const articles = result.records.map((record) => record.get("article"));
		const articlesWithDetails = await populateAuthorDetails(articles);
		res
			.status(200)
			.json({ status: "success", data: { articles: articlesWithDetails } });
	} catch (err) {
		console.error("Error getting articles by category:", err);
		res.status(500).json({ status: "fail", error: "Internal Server Error" });
	}
};

exports.getArticlesByTags = async (req, res) => {
	let { tags } = req.query;
	if (!Array.isArray(tags)) {
		tags = [tags];
	}
	console.log(tags);
	let articles = [];
	try {
		for (let i = 0; i < tags.length; i++) {
			const tagName = tags[i];
			const result = await session.run(queries.GET_ARTICLES_BY_TAG, {
				tagName,
			});
			const s = result.records.map((record) => record.get("article"));
			s.map((article) => articles.push(article));
		}
		let articlesWithDetails = await populateAuthorDetails(articles);
		articlesWithDetails = _.uniqBy(articlesWithDetails, "articleId");
		res
			.status(200)
			.json({ status: "success", data: { articles: articlesWithDetails } });
	} catch (err) {
		console.error("Error getting articles by tags:", err);
		res.status(500).json({ status: "fail", error: "Internal Server Error" });
	}
};

exports.getNonIndexedArticles = async () => {
	try {
		const result = await session.run(queries.GET_NOT_INDEXED_ARTICLES);
		// console.log(result.records);
		const articles = result.records.map((record) => record.get("article"));
		return articles;
	} catch (err) {
		console.error("Error getting non indexed articles:", err);
	}
};

exports.createRelationtoIndexed = async (articleId) => {
	try {
		await session.run(queries.CREATE_RELATION_TO_INDEXED, { articleId });
	} catch (error) {
		console.error("Error creating relation to indexed:", error);
	}
};

exports.createSimilarArticles = async (
	firstArticleId,
	secondArticleId,
	score
) => {
	try {
		await session.run(queries.CREATE_SIMILAR_ARTICLES, {
			firstArticleId,
			secondArticleId,
			score,
		});
	} catch (error) {
		console.error("Error creating similar articles:", error);
	}
};

exports.deleteArticle = async (req, res) => {
	const { id: articleId } = req.params;
	try {
		await session.run(queries.DELETE_ARTICLE, { articleId });
		res
			.status(200)
			.json({ status: "success", message: "Article deleted successfully" });
	} catch (err) {
		console.error("Error deleting article:", err);
		res.status(500).json({ status: "fail", error: "Internal Server Error" });
	}
};

exports.getArticlesByKeywords = async (req, res) => {
	const { text } = req.body;
	const { relatedArticles, dataForUser } = await findRelatedArticlesByUserInput(
		text
	);
	const articlesWithDetails = await Promise.all(
		dataForUser.map(async (article) => {
			const first_name = article.article.author.split(" ")[0];
			const last_name = article.article.author.split(" ")[1];
			const author = await getUserDetails(null, first_name, last_name);
			if (article.article.collaborators.length != 0) {
				const collaborators = await Promise.all(
					article.article.collaborators.map((collaboratorname) =>
						getUserDetails(
							null,
							collaboratorname.split("")[0],
							collaboratorname.split("")[1]
						)
					)
				);

				return { ...article, author, collaborators };
			}
			return { ...article, author };
		})
	);
	res.status(200).json({
		status: "success",
		data: { articles: articlesWithDetails },
	});
};

exports.getArticleById = async (req, res) => {
	const { id: articleId } = req.params;
	try {
		const result = await session.run(queries.FIND_ARTICLE_BY_ID, { articleId });
		const article = result.records[0].get("article");
		const author = await getUserDetails(article.author, null, null);
		const collaborators = await Promise.all(
			article.collaborators.map((collaboratorId) =>
				getUserDetails(collaboratorId, null, null)
			)
		);
		const articleWithDetails = { ...article, author, collaborators };

		const articleView = await ArticleViews.findOne({
			article_id: articleId,
			user: req.user._id,
		});
		if (!articleView) {
			await ArticleViews.create({ article_id: articleId, user: req.user._id });
		}

		res
			.status(200)
			.json({ status: "success", data: { article: articleWithDetails } });
	} catch (err) {
		console.error("Error getting article by id:", err);
		res.status(500).json({ status: "fail", error: "Internal Server Error" });
	}
};
