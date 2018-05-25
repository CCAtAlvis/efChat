var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "./src" + q.pathname;
  console.log(filename);
  fs.readFile(filename, function(err, data) {
      if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          res.write(filename);
          return res.end("404 Not Found");
    }
    res.writeHead(200);
    res.write(data);
    return res.end();
  });
}).listen(5685); 