var sys = require('sys'),
	http = require('http'),
    rest = require('./restler');

renderProducts = function(response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<html><body>');
	
	rest.get('https://brita.testbackend.appspot.com/rest/products', {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('success', function(data) {
		response.write('<ul>');
		data.forEach(function(i) {
			response.write('<li><a href="#">' + i.title + '</a></li>');
		});
		response.write('</ul>');
	}).on('complete', function(data) {
		response.end('</body></html>');
	}).on('error', function(data) {
		response.write('An error occured.');
		response.end('</body></html>');
	});
}


http.createServer(function (request, response) {	
	renderProducts(response);		
}).listen(11757);
