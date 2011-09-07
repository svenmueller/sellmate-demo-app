/**
 * Module dependencies.
 */
var sys = require('sys'),
	express = require('express'),
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


/*
http.createServer(function (request, response) {	
	renderProducts(response);		
}).listen(11757);
*/




/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'Express'
    },
	'products': products
  });
});

app.get('/products/:id', function(req, res){
	rest.get('https://brita.testbackend.appspot.com/rest/products/' + req.params.id, {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('complete', function(data) {
		res.render('product', {
	    locals: {
	      title: data.title
	    },
		'product': data
	  });
	});
});


app.get('/products', function(req, res){
	
	rest.get('https://brita.testbackend.appspot.com/rest/products', {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('complete', function(data) {
		res.render('index', {
	    locals: {
	      title: 'Products'
	    },
		'products': data
	  });
	});
	
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(11757);
  console.log("Express server listening on port %d", app.address().port)
}
