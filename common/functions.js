// TWITTER
function getTwitterStream() {
	document.getElementById("tweetstream").innerHTML = "";
	var ts = "";
	$.getJSON("http://search.twitter.com/search.json?q=iceland%20guide&rpp=20&callback=?", function(tweets) {
		for (var i = 0; i < tweets.results.length; i++) {
			ts += "<a href='http://twitter.com/" + tweets.results[i].from_user + "' target='_blank'>" + "<img src='" + tweets.results[i].profile_image_url + "' title='" + tweets.results[i].from_user + "'></img>" + "</a> tweets: <br/><spabn class='bt'>" + tweets.results[i].text + "</span><br/><br/>";

		}
		$("#tweetstream").append(ts);
	});
}

// WEATHER
function getWeatherData() {
	api_key = "be6e48c04ed74016";
	$.ajax({
		url : "http://api.wunderground.com/api/" + api_key + "/forecast/q/Iceland/Reykjavik.json",
		dataType : "jsonp",
		success : function(weatherData) {
			content = "<tr>";
			$.each(weatherData.forecast.txt_forecast.forecastday, function(i, item) {
				content += "<td align='center'><span class='d'>" + item.title + "</span></td>";
			});
			content += "</tr>";
			$("#weather_table").append(content);
			content = "<tr>";
			$.each(weatherData.forecast.txt_forecast.forecastday, function(i, item) {
				content += "<td align='center'><img src='" + item.icon_url + "' /></td>";
			});
			content += "</tr>";
			$("#weather_table").append(content);
			content = "<tr>";
			$.each(weatherData.forecast.txt_forecast.forecastday, function(i, item) {
				content += "<td class='weather-description'>" + item.fcttext_metric + "</td>";
			});
			content += "</tr>";

			$("#weather_table").append(content);
		}
	});
}

// FLICKR
function getFlickrImages() {
	api_key = "b427025ca7fe41bff1a85a05e1f0206e";
	$.getJSON("http://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + api_key + "&text=iceland&per_page=500&format=json&jsoncallback=?", function(data) {
		var infoWindow = new google.maps.InfoWindow();
		$.each(data.photos.photo, function(i, item) {
			$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.geo.getLocation&api_key=' + api_key + '&photo_id=' + item.id + '&format=json&jsoncallback=?', function(geoInfo) {
				if (geoInfo.stat != 'fail') {
					var marker = new google.maps.Marker({
						map : map,
						icon : fk,
						position : new google.maps.LatLng(geoInfo.photo.location.latitude, geoInfo.photo.location.longitude),
						title : item.title
					});
					google.maps.event.addListener(marker, 'click', function() {
						infoWindow.setContent('<img width="160" src="http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg" />' + "<br/>" + item.title);
						infoWindow.open(map, this);
					});

				}
			});
		});
	});
}