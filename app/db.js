const neo4j = require('neo4j');
const db = new neo4j.GraphDatabase({
  url: process.env.NEO4J_URL || 'http://localhost:7474',
  auth: {
    username: process.env.NEO4J_USERNAME,
    password: process.env.NEO4J_PASSWORD
  }
});

module.exports = db;
