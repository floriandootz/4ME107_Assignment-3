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
	res.writeHead(200, {'Content-Type': 'application/json'});
	//res.writeHead(200, {'Connection': 'keep-alive'});
	console.log("----start----");
	var returnArray = [];
	
	// URL Params
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var callback = '';
	var priceMin = 0;
	var priceMax = 1000;
	
	// GET Params
	if (query.callback) {
		callback = query.callback;
		console.log('Callback Function: ' +query.callback);
	}
	if (query.priceMin) {
		priceMin = query.priceMin;
	}
	if (query.priceMax) {
		priceMax = query.priceMax;
	}
	
	// Functionality
	var hotelUrl = 'http://www.kayak.com/h/rss/hotelrss/IS/Reykjavik?mc=EUR';
	http.get(hotelUrl, function(hotelRes) {
		var xml = "";
		hotelRes.on('data', function(chunk) {
			xml += chunk;
		});
		hotelRes.on('end', function() {
			parseString(xml, function (err, result) {
				var array = result.rss.channel[0].item;
				array.forEach( function(item) {
					var price = parseInt(item['kyk:price'][0]);
					if (price <= priceMax && price >= priceMin) {
						var obj = new Object();
						obj.name = item.title[0];
						obj.externalLink = item.link[0];
						obj.price = price;
						obj.stars = item['kyk:stars'][0];
						obj.image = item['kyk:thumbnail'][0];
						returnArray.push(obj);
					}
				});
				console.log("-----end-----");
				// Output
				if (callback) {
					res.write(callback + '(' + JSON.stringify(returnArray) + ');');
				}
				else {
					res.write(JSON.stringify(returnArray));
				}
				res.end();
			});
		});
	});
});

srv.listen(port, ip);
console.log('Server running at http://'+ip+':'+port+'/');