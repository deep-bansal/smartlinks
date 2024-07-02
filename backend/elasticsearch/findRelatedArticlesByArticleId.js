const client = require("../config/elasticsearch"); // Function to find related articles using Elasticsearch More Like This Query
const findRelatedArticlesById = async (articleId) => {
	try {
		const { body } = await client.search({
			index: "articles",
			body: {
				query: {
					more_like_this: {
						fields: ["title", "content"],
						like: [{ _id: articleId }],
						min_term_freq: 1,
						max_query_terms: 25,
					},
				},
			},
		});

		const relatedArticles = body.hits.hits.map((hit) => ({
			id: hit._id,
			score: hit._score,
			// Include other relevant fields
		}));
		return relatedArticles;
	} catch (error) {
		console.error("Error finding related articles:", error);
		throw error;
	}
};
