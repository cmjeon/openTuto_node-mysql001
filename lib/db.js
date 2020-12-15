var mysql = require('mysql');
var db = mysql.createConnection({
  host     : '192.168.0.2',
  port     : '3307',
  user     : 'test',
  password : 'test1234',
  database : 'opentutorials'
});
db.connect();
module.exports = db;