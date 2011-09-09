/**
 * Module dependencies.
 */
var sys = require('sys'),
	http = require('http'),
    rest = require('./restler');

exports.load = function (collectionId, handler) {
	var target = 'https://brita.testbackend.appspot.com/rest/collections/' + collectionId + '?fields=title';
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('success', function(data) {
		handler(null, data);	
	}).on('error', function(data) {
		handler(new Error("Failed to load collection"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.list = function (handler) {
	var target = 'https://brita.testbackend.appspot.com/rest/collections?fields=title';
	console.time(target);
	rest.get(target, {'headers':{'Authorization':'Bearer 3fcf95ee-1db6-4079-a240-13980383647b'}}).on('success', function(data) {
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load collections"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}