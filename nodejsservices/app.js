// Imports
var http = require('http');
var url = require('url');
var querystring = require("querystring");
var weather = require('./weather.js');
var hotels = require('./hotels.js');

// Server Vars
var ip = 'http://nodejsservice.eu01.aws.af.cm';
var port = 80;

var srv = http.createServer(function (req, res)
{
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	
	if (query.service) {
		service = query.service;
		res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
	
		if (service == 'hotels') {
			hotels.run(req, res, query);
		}
		else if (service == 'weather') {
			weather.run(req, res, query);
		}
		else {
			console.log("nothing to do");
			console.log("-----end-----");
			res.end();
		}
	}
	else {
		console.log("nothing to do");
		console.log("-----end-----");
		res.end();
	}
	
});

srv.listen(port, ip);
console.log('Server running at http://'+ip+':'+port+'/');