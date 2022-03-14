// Our database is hosted by Heroku and is JawsDB MYSQL. 

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'ckshdphy86qnz0bj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            : 'w0xgi67xzqdmcc7n',
  password        : 'w08iggaqkid9em19',
  database        : 'esrelor2d0v08v0v'
});
module.exports.pool = pool;




