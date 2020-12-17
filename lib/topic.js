var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
exports.home = function(request, response) {
  db.query(`SELECT * FROM topic`, (err, res) => {
    console.log(res);
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(res);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
       `<a href="/create">create</a>`);
    response.writeHead(200);
    response.end(html);
  });
}
exports.page = function(request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, (err1, res1) => {
    if(err1) {
      throw err1;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author On topic.author_id=author.id WHERE topic.id=?`, [queryData.id], (err2, res2) => {
      if(err2) {
        throw err2;
      }
      console.log(res2);
      var title = res2[0].title;
      var description = res2[0].description;
      var list = template.list(res1);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}
        <p>by ${res2[0].name}</p>`,
        `<a href="/create">create</a>
        <a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="delete">
          </form>
        `);
      response.writeHead(200);
      response.end(html);
    });
  })
}
exports.create = function(request, response) {
  db.query(`SELECT * FROM topic`, (err, res) => {
    db.query(`SELECT * FROM author`, (err2, authors) => {
      var title = 'Create';
      var list = template.list(res);
      var html = template.HTML(title, list,
        `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>`,
         `<a href="/create">create</a>`);
      response.writeHead(200);
      response.end(html);
    });
  });
}
exports.create_process = function(request, response) {
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          // fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          //   response.writeHead(302, {Location: `/?id=${title}`});
          //   response.end();
          // });
          db.query(`INSERT INTO topic (title, description, created, author_id)
            VALUES (?, ?, NOW(), ?)`, 
            [post.title, post.description, 1], (err, results) => {
              response.writeHead(302, {Location: `/?id=${results.insertId}`});
              response.end();
            });
      });
}
