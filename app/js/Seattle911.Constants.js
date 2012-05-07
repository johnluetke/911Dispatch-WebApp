Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Constants = {};

Seattle911.Constants.cityMapOptions = {
	center: new google.maps.LatLng(47.60832, -122.334737),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	zoom: 12,
	minZoom: 11,
	maxZoom: 17
}

Seattle911.Constants.incidentMapOptions = {
	disableDefaultUI: true,
	draggable: false,
	scrollwheel: false,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	zoom: 16,
	styles: [{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
	}]
}

Seattle911.Constants.buildingMapOptions = {
	disableDefaultUI: true,
	draggable: false,
	scrollwheel: false,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	zoom: 16,
	styles: [{
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{ visibility: "off" }
			]
	}]
}	

Seattle911.Constants.buildingStreetViewOptions = {
	addressControl: false,
	disableDefaultUI: true,
	draggable: false,
	enableCloseButton: false,
	linksControl: false,
	panControl: false,
	pov: {
		heading: 0,
		pitch: 0,
		zoom: 1
	},
	scrollwheel: false,
	zoomControl: false,
}
