var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '192.168.0.2',
    port     : '3307',
    user     : 'test',
    password : 'test1234',
    database : 'opentutorials'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
    if(error) {
        console.log(error);
    }
    console.log(results);
});
 
connection.end();