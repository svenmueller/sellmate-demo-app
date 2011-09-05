var http = require('http'), sys = require('sys'),
    rest = require('restler');

http.createServer(function (req, response) {
 
	rest.get('http://brita.testbackend.appspot.com/rest/products', {'headers': {'Authorization': 'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('complete', function(data) {
		response.writeHead(200, {'Content-Type': 'text/plain'});
  		response.write(data);
		response.end('Hello World\nApp (ctbox2) is running..YAY!');
	});

}).listen(11757);
