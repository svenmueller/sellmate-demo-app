/**
 * Module dependencies.
 */
var http = require('http'),
	Config = require('./config'),
    Rest = require('./restler');

exports.load = function (collectionId, handler) {
	var target = Config.shopUrl + '/rest/collections/' + collectionId + '?fields=title';
	console.time(target);
	Rest.get(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken}}).on('success', function(data) {
		handler(null, data);	
	}).on('error', function(data) {
		handler(new Error("Failed to load collection"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}

exports.list = function (handler) {
	var target = Config.shopUrl + '/rest/collections?fields=title';
	console.time(target);
	Rest.get(target, {'headers':{'Authorization':'Bearer ' + Config.accessToken}}).on('success', function(data) {
		handler(null, data);		
	}).on('error', function(data) {
		handler(new Error("Failed to load collections"), null);		
	}).on('complete', function(data) {
		console.timeEnd(target);		
	});
}
