// Imports
var http = require('http');
var url = require('url');
var parseString = require('xml2js').parseString;
var querystring = require("querystring");

// Server Vars
var months = ['january', 'february', 'march', 'april', 'may', 'june', 'juli', 'august', 'september', 'octobre', 'novembre', 'decembre'];
var ip = '127.0.0.1';
var port = 1337;

var srv = http.createServer(function (req, res)
{
	res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
	//res.writeHead(200, {'Connection': 'keep-alive'});
	console.log("----start----");
	var returnObj = new Object();
	
	// URL Params
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var callback = '';
	var day;
	var month;
	var year;
	var town;
	
	// GET Params
	if (query.callback) {
		callback = query.callback;
		console.log('Callback Function: ' +query.callback);
	}
	if (query.day) {
		day = query.day;
	}
	if (query.month) {
		month = query.month -1;
	}
	if (query.year) {
		year = query.year;
	}
	if (query.town) {
		town = query.town;
	}
	
	// Fetch weather for custom town
	var weatherUrl = 'http://api.wolframalpha.com/v2/query?input=weather%20' + town + '%20' + months[month] + '%20' + day + '%20' + year + '&appid=TU57XY-69H7Y4AJQG';
	http.get(weatherUrl, function(weatherRes) {
		var xml = "";
		weatherRes.on('data', function(chunk) {
			xml += chunk;
		});
		weatherRes.on('end', function() {
			parseString(xml, function (err, result) {
				var array = result.queryresult.pod;
				
				array.forEach( function(item) {
					if (item['$'].id == 'WeatherSummary:WeatherData')
					{
						returnObj.townText = item.subpod[0].plaintext[0];
						returnObj.townText = returnObj.townText.replace(' |', ':');
					}
				});
				
				if (returnObj.vxuText)
				{
					// Output
					if (callback) {
						res.write(callback + '(' + JSON.stringify(returnObj) + ');');
					}
					else {
						res.write(JSON.stringify(returnObj));
					}
					console.log("-----end-----");
					res.end();
				}
			});
		});
	});
	
	// Fetch weather for default town
	town = 'Reykjavik';
	var weatherUrl = 'http://api.wolframalpha.com/v2/query?input=weather%20' + town + '%20' + months[month] + '%20' + day + '%20' + year + '&appid=TU57XY-69H7Y4AJQG';
	http.get(weatherUrl, function(weatherRes) {
		var xml = "";
		weatherRes.on('data', function(chunk) {
			xml += chunk;
		});
		weatherRes.on('end', function() {
			parseString(xml, function (err, result) {
				var array = result.queryresult.pod;
				
				array.forEach( function(item) {
					if (item['$'].id == 'WeatherSummary:WeatherData')
					{						
						returnObj.vxuText = item.subpod[0].plaintext[0];
						returnObj.vxuText = returnObj.vxuText.replace(' |', ':');
					}
				});
				
				if (returnObj.townText)
				{
					// Output
					if (callback) {
						res.write(callback + '(' + JSON.stringify(returnObj) + ');');
					}
					else {
						res.write(JSON.stringify(returnObj));
					}
					console.log("-----end-----");
					res.end();
				}
			});
		});
	});
});

srv.listen(port, ip);
console.log('Server running at http://'+ip+':'+port+'/');