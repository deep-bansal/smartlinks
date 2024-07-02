const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const path = require("path");

const certPath = path.join(__dirname, "http_ca.crt");

const client = new Client({
	node: process.env.ELASTICSEARCH_ENDPOINT,
	auth: {
		username: process.env.ELASTICSEARCH_USERNAME,
		password: process.env.ELASTICSEARCH_PASSWORD,
	},
});

// Example: Ping Elasticsearch
client
	.ping()
	.then((response) => {
		console.log("Elasticsearch ping successful:", response);
	})
	.catch((error) => {
		console.error("Error pinging Elasticsearch:", error);
	});

module.exports = client;
