/**
 * Module dependencies.
 */
var sys = require('sys'),
	http = require('http'),
    rest = require('./restler');


exports.load = function (productId, handler) {	
	var target = 'https://brita.testbackend.appspot.com/rest/products/' + productId;	
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer fbce5091-418b-4b6f-852f-2cf4030f043d'}}).on('success', function(data) {
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load product"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.list = function (handler) {
	var target = 'https://brita.testbackend.appspot.com/rest/products?fields=title,images';
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer fbce5091-418b-4b6f-852f-2cf4030f043d'}}).on('success', function(data) {
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load products"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.listByCollection = function (collectionId, handler) {
	var target = 'https://brita.testbackend.appspot.com/rest/collections/' + collectionId + '/products';
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer fbce5091-418b-4b6f-852f-2cf4030f043d'}}).on('success', function(data) {
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load collection products"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}
