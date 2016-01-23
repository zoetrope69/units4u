require('dotenv').config(); // pull in environment variables from .env

const db = require('./db');

const query = `
  CREATE (COSINE:Unit {title:'COSINE', weight: 20, keywords:['low-level', 'architecture', 'networking']})
  CREATE (Keanu:Person {name:'Keanu Reeves', interests:['networks', 'graphics', 'C']})
  CREATE (Carrie:Person {name:'Carrie-Anne Moss', interests:['operating systems', 'maths', 'assembly']})
  CREATE (Laurence:Person {name:'Laurence Fishburne', interests:['business', 'interface', 'user experience']})
  CREATE
    (Keanu)-[:STUDIED {sentiment:0.8}]->(COSINE),
    (Carrie)-[:STUDIED {sentiment:0.9}]->(COSINE),
    (Laurence)-[:STUDIED {sentiment:-0.3}]->(COSINE)
  CREATE (WEBSCRP:Unit {title:"WEBSCRP", weight:20, keywords:['javascript', 'web', 'html5', 'REST', 'API', 'AJAX']})
  CREATE (Charlize:Person {name:'Charlize Theron', interests:['web', 'design', 'user experience', 'javascript']})
  CREATE (Al:Person {name:'Al Pacino', interests:['modern', 'database', 'security']})
  CREATE (Taylor:Person {name:'Taylor Hackford', interests:['programming', 'testing', 'engineering']})
  CREATE
    (Keanu)-[:STUDIED {sentiment:0.6}]->(WEBSCRP),
    (Charlize)-[:STUDIED {sentiment:1.0}]->(WEBSCRP),
    (Al)-[:STUDIED {sentiment:-0.7}]->(WEBSCRP),
    (Taylor)-[:STUDIED {sentiment: 0.1}]->(WEBSCRP)
`;

db.cypher({ query }, (err) => {

  if (err) {
    return console.log(err);
  }

  console.log('Database seeded...');

});
