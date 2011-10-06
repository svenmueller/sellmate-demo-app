/**
 * Module dependencies.
 */
var sys = require('sys'),
	express = require('express'),
	http = require('http'),
	Collection = require('./collection');
	Product = require('./product');

var app = module.exports = express.createServer();

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

//setup the errors
app.error(function(err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('404', { locals: {
			header: '#Header#'
			,footer: '#Footer#'
			,title : '404 - Not Found'
			,description: ''
			,author: ''
			,analyticssiteid: 'XXXXXXX'
		},status: 404, layout: false});
    } else {
        res.render('500', { locals: {
			header: '#Header#'
			,footer: '#Footer#'
			,title : 'The Server Encountered an Error'
			,description: ''
			,author: ''
			,analyticssiteid: 'XXXXXXX'
			,error: err
		}, status: 500 , layout: false});
    }
});

// Configuration

app.configure(function() {
  	app.set('views', __dirname + '/views');
  	app.set('view engine', 'jade');
  	app.use(express.bodyParser());
  	app.use(express.methodOverride());
  	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure('development', function() {
  	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	console.log("using config for 'development'");
});

app.configure('production', function() {
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

app.post('/products', createProduct, function(req, res) {
	console.log("create product");
	res.redirect('/products/' + req.product.id);
});

//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});


//The 404 Route (ALWAYS Keep this as the last route)

app.get('/*', function(req, res){
    throw new NotFound;
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

function createProduct(req, res, next) {
	var newProduct = {};
	newProduct.title = "TEST Product";
	newProduct.vendor = "vendor 1";
	newProduct.product_type = "type 1";
	newProduct.options = [{"name" : "size"}];
	Product.create(newProduct, function(err, product) {
		if (err) {
			return next(err);
		}
    	if (!product) {
			return next(new Error('failed to create product'));
		}
    	req.prodúct = product;
    	next();
  	});
}

// Only listen on $ node app.js

if (!module.parent) {
	app.listen(11757);
  	console.log("Express server listening on port %d", app.address().port)
}
