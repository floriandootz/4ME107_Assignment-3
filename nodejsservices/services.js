// Imports
var http = require('http');
var url = require('url');
var parseString = require('xml2js').parseString;
var querystring = require("querystring");

// Server Vars
var ip = '127.0.0.1';
var port = 1337;

var srv = http.createServer(function (req, res)
{
	// res.writeHead(200, {'Content-Type': 'application/json'});
	
});

srv.listen(port, ip);
console.log('Server running at http://'+ip+':'+port+'/');