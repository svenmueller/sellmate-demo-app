/**
 * Module dependencies.
 */
var sys = require('sys'),
	express = require('express'),
	http = require('http'),
    rest = require('./restler');

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
      title: 'Home'
    }
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
		res.render('products', {
	    	locals: {
	      		title: 'Products'
	    	},
			'products': data
		});
	});
	
});

app.get('/collections', function(req, res){
	
	rest.get('https://brita.testbackend.appspot.com/rest/collections', {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('complete', function(data) {
		res.render('collections', {
	    	locals: {
	      		title: 'Collections'
	    	},
			'collections': data
	  	});
	});
	
});

app.get('/collections/:id', function(req, res){
	
	rest.get('https://brita.testbackend.appspot.com/rest/collections/' + req.params.id, {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('complete', function(collection) {
		rest.get('https://brita.testbackend.appspot.com/rest/collections/' + req.params.id + '/products', {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('complete', function(products) {
			res.render('collection', {
		    	locals: {
		      		title: collection.title
		    	},
				'products': products,
				'collection': collection
		  	});
		});
	});
	
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(11757);
  console.log("Express server listening on port %d", app.address().port)
}
