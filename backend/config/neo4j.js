var neo4j = require("neo4j-driver");

const URI = process.env.NEO4J_URI;
const USER = process.env.NEO4J_USERNAME;
const PASSWORD = process.env.NEO4J_PASSWORD;
const driver = neo4j.driver(
	URI, // Replace with your Neo4j instance URL
	neo4j.auth.basic(USER, PASSWORD) // Replace with your Neo4j username and password
);

const session = driver.session();
module.exports = session;
