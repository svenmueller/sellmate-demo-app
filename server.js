var sys = require('sys'),
	http = require('http'),
    rest = require('./restler');

renderProducts = function(response) {
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write('<html><body>');
	
	rest.get('https://brita.testbackend.appspot.com/rest/products', {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('success', function(data) {
		response.write('<ul>');
		data.forEach(function(product) {
			response.write('<li><a href="#" title="' + product.title +'">');
			if (product.images.length > 0) {
				response.write('<img src="' + product.images[0].url +'&size=150" alt="' + product.title +'" title="' + product.title + '"/>');
			}
			response.write('</a></li>');
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
