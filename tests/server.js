var http = require('http');

exports.createServer = function(port) {
	port = port || 6767
	var s = http.createServer(function(req, res) {
		s.emit(req.url, req, res)
	})
	s.port = port
	s.url = 'http://localhost' + port
	return s;
}