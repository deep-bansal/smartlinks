const client = require("../config/elasticsearch");

exports.createArticleIndex = async () => {
	try {
		// Define index settings and mappings
		const indexName = "articles";
		const settings = {
			settings: {
				number_of_shards: 1,
				number_of_replicas: 1,
				analysis: {
					analyzer: {
						my_analyzer: {
							type: "custom",
							tokenizer: "standard",
							filter: ["lowercase", "stop", "snowball"],
						},
					},
				},
			},
			mappings: {
				properties: {
					articleId: { type: "keyword" },
					author: { type: "keyword" },
					title: { type: "text", analyzer: "my_analyzer" },
					content: { type: "text", analyzer: "my_analyzer" },
					tags: { type: "keyword" },
					collaborators: { type: "keyword" },
					category: { type: "keyword" },
					created_at: { type: "date" },
				},
			},
		};

		// Check if the index already exists
		const indexExists = await client.indices.exists({ index: indexName });

		if (indexExists) {
			console.log(`Index "${indexName}" already exists.`);
		} else {
			// Create the index
			const response = await client.indices.create({
				index: indexName,
				body: settings,
			});
			console.log("Index created:", response);
		}
	} catch (error) {
		console.error("Error creating index:", error);
	}
};

exports.deleteArticleIndex = async () => {
	const indexName = "articles";

	try {
		const response = await client.indices.delete({
			index: indexName,
		});
		console.log(`Index "${indexName}" deleted.`, response);
	} catch (error) {
		if (error.statusCode === 404) {
			console.log(`Index "${indexName}" not found.`);
		} else {
			console.error(`Error deleting index "${indexName}":`, error);
		}
	}
};

// Call the function to delete the index
// deleteArticleIndex();
