// We need this to build our post string
var querystring = require('querystring'),
	request 	= require('request'),
	Config 		= require('../config'),
	OAuth2 		= require('node-sellmate').OAuth2;

var oa = new OAuth2(Config.client_id, Config.client_secret, Config.redirect_uri, Config.host_auth);

// Request coming from '/'
exports.index = function(req, res) {
	res.render('index', {
		locals: { 
			title: 'Home'
		}
	});
};

// Request coming from '/callback'
exports.callback = function(req, res) {
	var code = req.query['code'];
	console.log("Callback received with code: " + code);

	oa.getAccessToken(code, {
		'shop': Config.shop,
		'grant_type': Config.grant_type_auth,
	}, function(error, response, body) {
		console.log("Body received: " + body);
		var json_body = JSON.parse(body);

		if (response.statusCode == 200) {
			// Save the tokens
			req.session.oauth_access_token = json_body.access_token;
			req.session.oauth_refresh_token = json_body.refresh_token;
		} else {
			console.log('Error code: ' + response.statusCode);
			// Do something else like requesting a new access_token or grant_code
		}
		res.writeHead(200, {"Content-Type": "application/json"});
		res.write(JSON.stringify(json_body, null, 4));
		res.end();
	});
};

// Request coming from '/products/page/:page([0-9]+)'
exports.products = function(req, res) {
	var page = parseInt(req.params.page);
	var pages = parseInt(req.count / Config.pageLimit) + ((req.count % Config.pageLimit)?1:0);

	if (page > pages) {
		throw new NotFound('Page not found.');
	} else {
		res.render('products', {
	    	locals: {
				title: 'Products'
	   		},
			'products': req.products,
			'current': page,
			'pages': pages,
			'productsCount': req.count
		});
	}
};

// Request coming from '/products/:productId'
exports.productId = function(req, res) {
	// Request comes from a precondition
	res.render('product', {
	    locals: {
	      title: req.product.title
	    },
		'product': req.product
	});
};

// Request coming from '/collections'
exports.collections = function(req, res) {
	res.render('collections', {
	    locals: {
	      	title: 'Collections'
	    },
		'collections': req.collections
	});	
};

// Request coming from '/collections/:collectionId'
exports.collectionId = function(req, res) {
	//var collectionId = req.params.collectionId;
	res.render('collection', {
	    locals: {
	   		title: req.collection.title
	   	},
		'products': req.products,
		'collection': req.collection
  	});	
};
