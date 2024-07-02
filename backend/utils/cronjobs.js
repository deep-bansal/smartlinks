const { bulkIndexArticles } = require("../elasticsearch/indexArticle");
const {
	getNonIndexedArticles,
	createRelationtoIndexed,
} = require("../controllers/articleController");

exports.indexArticles = async () => {
	try {
		const articles = await getNonIndexedArticles();
		// console.log(articles);
		await bulkIndexArticles(articles);
		articles.map(async (article) => {
			await createRelationtoIndexed(article.articleId);
		});
	} catch (err) {
		console.error("Error indexing articles:", err);
	}
};
