const express = require("express");
const router = express.Router();
const {
	createArticle,
	addCollaborator,
	removeCollaborator,
	viewInEditMode,
	getArticlesByCategory,
	getArticlesByTags,
	getArticlesByCategoryandTags,
	deleteArticle,
	getArticlesByKeywords,
	getArticleById,
} = require("../../../controllers/articleController");

const { protect } = require("../../../controllers/authController");

router
	.route("/")
	.get((req, res) => {
		if (req.query.category && req.query.tags) {
			getArticlesByCategoryandTags(req, res);
		} else if (req.query.category) {
			getArticlesByCategory(req, res);
		} else {
			getArticlesByTags(req, res);
		}
	})
	.post(getArticlesByKeywords);

router
	.route("/:id")
	.get(protect, getArticleById)
	.post(protect, createArticle)
	.delete(protect, deleteArticle);
router
	.route("/collaborator/:id")
	.post(protect, addCollaborator)
	.delete(protect, removeCollaborator);

router.route("/edit/:id").get(protect, viewInEditMode);

module.exports = router;
