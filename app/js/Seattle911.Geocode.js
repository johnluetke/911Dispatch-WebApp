Seattle911.Geocode = {};
Seattle911.Geocode.Overlay = {};

Seattle911.Geocode.Locate = function(loc, callback) {

	if (Seattle911.Geocode.Overlay.Point != undefined) {
		Seattle911.Geocode.Overlay.Point.setMap(null);
		Seattle911.Geocode.Overlay.Area.setMap(null);
	}

	google.maps.event.addListener(Seattle911.UI.Map, 'zoom_changed', function() {
		if (Seattle911.Geocode.Overlay.Point != undefined) {
			radius = 0;
			if (Seattle911.UI.Map.getZoom() == 17)
				radius = 10;
			else if (Seattle911.UI.Map.getZoom() == 16)
				radius = 15;
			else if (Seattle911.UI.Map.getZoom() == 15)
				radius = 30;
			else if (Seattle911.UI.Map.getZoom() == 14)
				radius = 60;
			else if (Seattle911.UI.Map.getZoom() == 13)
				radius = 120;
			else if (Seattle911.UI.Map.getZoom() == 12)
				radius = 240;
			else if (Seattle911.UI.Map.getZoom() == 11)
				radius = 380;

			if (Seattle911.UI.Map.getZoom() <= 15)
				Seattle911.Geocode.Overlay.Area.setMap(null);
			else
				Seattle911.Geocode.Overlay.Area.setMap(Seattle911.UI.Map);

			Seattle911.Geocode.Overlay.Point.setRadius(radius);
		}
	});

	if (loc == undefined) {
		if (Seattle911.UI.Settings.HasAddress() && Seattle911.UI.Settings.AddressEnabled())
			loc = Seattle911.UI.Address();
		else
			loc = "me";
	}

	if (loc == "me") {
		if ($("html").hasClass("geolocation")) {
			navigator.geolocation.getCurrentPosition(function(position) {
			
				latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				accuracy = position.coords.accuracy;

				Seattle911.Geocode.Process(latlng, accuracy, callback);
			},
			function(error) {
				switch (error.code) {
					case 1: // Permission denied
						alert("You've declined to share your current location");
						break;
					case 2: // Unavailable
						alert("Your location could not be determined");
						break;
					case 3: // Timeout
						alert("We were unable to locate you. Please try again later");
						break;
				}
			});
		}
		else {
			alert("We're Sorry, but your browser does not support Geolocation");
		}
	}
	else {
		Seattle911.Address.Geocode(loc, function(data) {
			latlng = new google.maps.LatLng(data.latitude, data.longitude);
			accuracy = 0;

			Seattle911.Geocode.Process(latlng, accuracy, callback);
		});
	}
}

Seattle911.Geocode.Process = function(latlng, accuracy, callback) {
	Seattle911.UI.Map.setCenter(latlng);
	Seattle911.UI.Map.setZoom(17);

	var meters;
	switch (Seattle911.UI.Settings.UOM()) {
		case "mi": meters = 1609.344 * parseFloat(Seattle911.UI.Settings.Distance()); break;
		case "km": meters = 1000 * parseFloat(Seattle911.UI.Settings.Distance()); break;
		default: meters = 0; break;
	}

	Seattle911.Geocode.Overlay.Point = new google.maps.Circle({
		map: Seattle911.UI.Map,
		strokeWeight: 0,
		fillColor: '#0000FF',
		fillOpacity: 0.6,
		center: latlng,
		radius: 10,
		clickable: false
	});

	Seattle911.Geocode.Overlay.Area = new google.maps.Circle({
		map: Seattle911.UI.Map,
		strokeColor: '#63B8FF',
		strokeOpactity: 0.8,
		strokeWeight: 2,
		fillColor: '#63B8FF',
		fillOpacity: 0.5,
		center: latlng,
		radius: accuracy,
		clickable: false
	});

	Seattle911.Geocode.Overlay.Radius = new google.maps.Circle({
		clickable: false,
		center: latlng,
		fillColor: "green",
		fillOpacity: .2,
		map: Seattle911.UI.Map,
		radius: meters,
		strokeColor: "green",
		strokeOpacity: .3,
		strokeWeight: 1

	});

	Seattle911.Incidents.NearLocation(latlng.lat(), latlng.lng(), callback);
}
