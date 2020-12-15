var mysql = require('mysql');
var db = mysql.createConnection({
  host     : '',
  port     : '',
  user     : '',
  password : '',
  database : ''
});
db.connect();
module.exports = db;