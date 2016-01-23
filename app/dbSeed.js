require('dotenv').config(); // pull in environment variables from .env

const db = require('./db');

const query = `
  CREATE (COSINE:Unit {title:'COSINE', weight: 20, keywords:['low-level', 'architecture', 'networking']})
  CREATE (WEBSCRP:Unit {title:"WEBSCRP", weight:20, keywords:['javascript', 'web', 'html5', 'REST', 'API', 'AJAX']})

  CREATE (Keanu:Person {name:'Keanu Reeves', interests:['networks', 'graphics', 'C']})
  CREATE (Carrie:Person {name:'Carrie-Anne Moss', interests:['operating systems', 'maths', 'assembly']})
  CREATE (Laurence:Person {name:'Laurence Fishburne', interests:['business', 'interface', 'user experience']})
  CREATE (Charlize:Person {name:'Charlize Theron', interests:['web', 'design', 'user experience', 'javascript']})
  CREATE (Al:Person {name:'Al Pacino', interests:['modern', 'database', 'security']})
  CREATE (Taylor:Person {name:'Taylor Hackford', interests:['programming', 'testing', 'engineering']})

  CREATE
    (Keanu)-[:REVIEWED {sentiment:0.8, keywords:['maths', 'hard', 'fun']}]->(COSINE),
    (Carrie)-[:REVIEWED {sentiment:0.9, keywords:['logic', 'computers']}]->(COSINE),
    (Laurence)-[:REVIEWED {sentiment:-0.3, keywords:['difficult', 'group', 'work']}]->(COSINE),
    (Charlize)-[:REVIEWED {sentiment:0.6, keywords:['easy', 'project', 'coursework', 'fun']}]->(WEBSCRP),
    (Charlize)-[:REVIEWED {sentiment:1.0, keywords:['php', 'javascript']}]->(WEBSCRP),
    (Al)-[:REVIEWED {sentiment:-0.7}]->(WEBSCRP),
    (Taylor)-[:REVIEWED {sentiment: 0.1}]->(WEBSCRP)

  CREATE
    (Keanu)-[:STUDIED {grade: 80}]->(COSINE),
    (Carrie)-[:STUDIED {grade: 40}]->(WEBSCRP),
    (Laurence)-[:STUDIED {grade: 50}]->(COSINE),
    (Al)-[:STUDIED {grade: 66}]->(WEBSCRP)
`;

db.cypher({ query }, (err) => {

  if (err) {
    return console.log(err);
  }

  console.log('Database seeded...');

});
