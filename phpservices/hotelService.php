<?php
	$priceMin = $_GET['priceMin'];
	$priceMax = $_GET['priceMax'];
	
	
	$xml_source = file_get_contents('http://www.kayak.com/h/rss/hotelrss/IS/Reykjavik?mc=EUR');
	$xml = simplexml_load_string($xml_source);
	$result = array();
	foreach ($xml->channel->item as $item) {
		$kyk = $item->children('http://www.kayak.com/h/rss/hotelextension');
		$price = (int)$kyk->price;
		if ($price < $priceMax && $price > $priceMin) {
			$entry = new stdClass();
			$entry->name = (string)$item->title;
			$entry->externalLink = (string)$item->link;
			$entry->price = $price;
			$entry->stars = (int)$kyk->stars;
			$entry->image = (string)$kyk->thumbnail;
			$result[] = $entry;
		}
	}
	
	echo json_encode($result);
?>
