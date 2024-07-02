const client = require("../config/elasticsearch");
exports.indexArticle = async (article) => {
	try {
		const response = await client.index({
			index: "articles",
			body: article,
		});
		console.log("Article indexed:", response);
	} catch (error) {
		console.error("Error indexing article:", error);
	}
};

exports.bulkIndexArticles = async (articles) => {
	try {
		const body = articles.flatMap((article) => [
			{ index: { _index: "articles" } },
			article,
		]);
		// console.log(body);

		const response = await client.bulk({ refresh: true, body });
		if (response.errors) {
			const erroredDocuments = [];
			response.items.forEach((action, i) => {
				const operation = Object.keys(action)[0];
				if (action[operation].error) {
					erroredDocuments.push({
						status: action[operation].status,
						error: action[operation].error.reason,
						operation: body[i * 2],
						document: body[i * 2 + 1],
					});
				}
			});
			console.error("Error indexing articles:", erroredDocuments);
		}

		console.log("Bulk indexing completed.");
	} catch (error) {
		console.error("Error during bulk indexing:", error);
	}
};
