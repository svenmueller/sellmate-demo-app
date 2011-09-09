/**
 * Module dependencies.
 */
var sys = require('sys'),
	express = require('express'),
	http = require('http'),
	Collection = require('./collection');
	Product = require('./product');

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
  	app.set('views', __dirname + '/views');
  	app.set('view engine', 'jade');
  	app.use(express.bodyParser());
  	app.use(express.methodOverride());
  	app.use(app.router);
  	app.use(express.static(__dirname + '/public'));	
});

app.configure('development', function() {
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log("using config for 'development'");
});

app.configure('production', function() {
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log("using config for 'production'"); 
});


// Routes

app.get('/', function(req, res) {
  res.render('index', {
    locals: {
      title: 'Home'
    }
  });
});


app.get('/products/:productId', function(req, res) {
	console.log("loading product");
	res.render('product', {
	    locals: {
	      title: req.product.title
	    },
		'product': req.product
	});
});


app.get('/products', loadProducts, function(req, res) {
	console.log("loading products");
	res.render('products', {
	    locals: {
			title: 'Products'
	   	},
		'products': req.products
	});	
});

app.get('/collections', loadCollections, function(req, res) {
	console.log("loading collections");
	res.render('collections', {
	    locals: {
	      	title: 'Collections'
	    },
		'collections': req.collections
	});	
});

app.get('/collections/:collectionId', function(req, res) {
	console.log("loading collection");
	res.render('collection', {
	    locals: {
	   		title: req.collection.title
	   	},
		'products': req.products,
		'collection': req.collection
  	});	
});



// Route Param Preconditions

app.param('productId', function(req, res, next, id) {
  Product.load(id, function(err, product) {
    if (err) {
		return next(err);
	}
    if (!product) {
		return next(new Error('failed to find product'));
	}
    req.product = product;
    next();
  });
})

app.param('collectionId', function(req, res, next, id) {
  Collection.load(id, function(err, collection) {
    if (err) {
		return next(err);
	}
    if (!collection) {
		return next(new Error('failed to find collection'));
	}
    req.collection = collection;
    next();
  });
})

// Helper methods

app.param('collectionId', function(req, res, next, id) {
	Product.listByCollection(id, function(err, products) {
		if (err) {
			return next(err);
		}
    	if (!products) {
			return next(new Error('failed to find collection products'));
		}
    	req.products = products;
    	next();
  	});
})

function loadProducts(req, res, next) {
	Product.list(function(err, products) {
		if (err) {
			return next(err);
		}
    	if (!products) {
			return next(new Error('failed to find products'));
		}
    	req.products = products;
    	next();
  	});
}

function loadProductsByCollection(req, res, next) {
	Product.list(req.collectionId, function(err, products) {
		if (err) {
			return next(err);
		}
    	if (!products) {
			return next(new Error('failed to find products'));
		}
    	req.products = products;
    	next();
  	});
}

function loadCollections(req, res, next) {
	Collection.list(function(err, collections) {
		if (err) {
			return next(err);
		}
    	if (!collections) {
			return next(new Error('failed to find collections'));
		}
    	req.collections = collections;
    	next();
  	});
}



// Only listen on $ node app.js

if (!module.parent) {
	app.listen(11757);
  	console.log("Express server listening on port %d", app.address().port)
}
