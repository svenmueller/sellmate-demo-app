var http = require('http'), sys = require('sys'),
    rest = require('restler');

http.createServer(function (req, response) {
 
	rest.get('http://www.google.com').on('complete', function(data) {
		response.writeHead(200, {'Content-Type': 'text/plain'});
  		response.write(data);
		response.end('Hello World\nApp (ctbox2) is running..YAY!');
	});

}).listen(11757);
