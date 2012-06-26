/**
 * Module dependencies.
 */
var http = require('http'),
	Config = require('./config'),
    rest = require('./restler'); 


exports.load = function (productId, handler) {	
	var target = Config.shopUrl + '/rest/products/' + productId;	
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken}}).on('success', function(data) {
		setMinMaxPrices(data);
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load product"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.count = function (handler) {	
	var target = Config.shopUrl + '/rest/products/count';	
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken}}).on('success', function(data) {
		handler(null, data.count);		
	}).on('error', function(data) {
		handler(new Error("Failed to load product count"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.list = function (page, limit, handler) {
	var target = Config.shopUrl + '/rest/products?fields=title,images&limit=' + limit + "&page=" + page;
	console.log(target);
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken}}).on('success', function(data) {		
		for (var i = 0; i < data.length; i++) {
			setMinMaxPrices(data[i]);
		}
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load products"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.listByCollection = function (collectionId, handler) {
	var target = Config.shopUrl + '/rest/collections/' + collectionId + '/products';
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken}}).on('success', function(data) {
		for (var i = 0; i < data.length; i++) {
			setMinMaxPrices(data[i]);
		}
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load collection products"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.prototype.create = function(req, res, next) {
	var newProduct = {};
	newProduct.title = "TEST Product";
	newProduct.vendor = "vendor 1";
	// TODO: create valid product
	
	Product._create(newProduct, function(err, product) {
		if (err) {
			return next(err);
		}
    	if (!product) {
			return next(new Error('failed to create product'));
		}
    	req.product = product;
    	next();
  	});
}

exports.prototype._create = function (product, handler) {
	var target = Config.shopUrl + '/rest/products';
	console.time(target);
	// Wrong!
	rest.post(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken, 'Content-Type':'application/json'}, data: JSON.stringify(product)}).on('success', function(data) {
		setMinMaxPrices(data);
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to create product"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

function setMinMaxPrices(product) {
	var prices = new Array();
	for (var i = 0; i < product.variants.length; i++) {
		prices[i] = product.variants[i].price;
	}
	prices.sort();
	product.price_min = prices[0];
	product.price_max = prices[prices.length - 1];
	if (product.price_min != product.price_max) {
		product.price_varies = true;
	}	
}
