const client = require("../config/elasticsearch");

exports.findRelatedArticlesByUserInput = async (userInput) => {
	try {
		const response = await client.search({
			index: "articles",
			body: {
				query: {
					multi_match: {
						query: userInput,
						fields: [
							"title^2",
							"content",
							"author",
							"collaborators",
							"tags",
							"category",
						],
						fuzziness: "AUTO", // Optional: Allow fuzzy matching
					},
				},
			},
		});

		const hits = response.hits.hits;
		const dataForUser = hits.map((hit, index) => ({
			article: hit._source,
		}));
		const relatedArticles = hits.map((hit) => ({
			id: hit._source.articleId,
			score: hit._score,
		}));
		return { relatedArticles, dataForUser };
	} catch (error) {
		console.error("Error finding related articles:", error);
		throw error;
	}
};
