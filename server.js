var http = require('http'), sys = require('sys'),
    rest = require('./restler');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

	rest.get('http://google.com').on('complete', function(data, res) {
  		res.write(data);
	});

  res.end('Hello World\nApp (ctbox2) is running..YAY!');
}).listen(11757);
