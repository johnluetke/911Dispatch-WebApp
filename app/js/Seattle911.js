var Seattle911 = {};
Seattle911.Action = {};
Seattle911.Address = {};
Seattle911.Area = {};
Seattle911.Constants = {};
Seattle911.Geocode = {};
Seattle911.Incidents = {};
Seattle911.List = {};
Seattle911.Session = {};
Seattle911.Screen = {};
Seattle911.Station = {};
Seattle911.UI = {};
Seattle911.UI.Settings = {};
Seattle911.Unit = {};

Seattle911.Screen.Width = $(window).width();
Seattle911.Screen.Height = $(window).height();

Seattle911.Session.FirstLoad = true;
Seattle911.Session.NewIncidentCount = 0;
Seattle911.Session.PageTitle = "Seattle 911";

Seattle911.Timer = null;

Seattle911.Session.Maps = {};
Seattle911.Session.Overlays = {};

Seattle911.Map = {};

Seattle911.Initialize = function() {

	$("#incident_list .container").html(Seattle911.Loading());
	
	$("#city_map").css('width', Seattle911.Screen.Width - Seattle911.List.Width);
	$("#city_map").css('height', Seattle911.Screen.Height - $("#header").height());
	$("#incident_list").css('height', Seattle911.Screen.Height - $("#header").height());

	Seattle911.UI.Map = new google.maps.Map(document.getElementById("city_map"), Seattle911.Constants.cityMapOptions);

	google.maps.event.addListener(Seattle911.UI.Map, 'zoom_changed', function() {
		zoomChangeBoundsListener = google.maps.event.addListener(Seattle911.UI.Map, 'bounds_changed', function(event) {
			Seattle911.UI.Map.getZoom();

			google.maps.event.removeListener(zoomChangeBoundsListener);
		});
	});

	$("#loadMore").click(function() {
		$(this).html("<img src=\"img/loading.gif\" />");
		d = Seattle911.Session.FirstFetch;
						
		early = d.getUTCFullYear()+"-";
		early += d.getUTCMonth()+1+"-";
		early += d.getUTCDate()+" ";
		early += d.getUTCHours()+":";
		early += d.getUTCMinutes()+":";
		early += d.getUTCSeconds();
	
		Seattle911.List.Fetch(early, "0001-01-01 00:00:00", "bottom");	
	});

	$("#list-selector li").click(function() {
		if ($(this).hasClass("active"))
			return;

		if (Seattle911.Geocode.Overlay.Point != undefined) {
			Seattle911.Geocode.Overlay.Point.setMap(null);
			Seattle911.Geocode.Overlay.Area.setMap(null);
		}

		$("#list-selector li").each(function() {
			$(this).removeClass("active");
		});
		$("#info").remove()
		$(this).addClass("active");
	});

	$("#list-selector-nearby a").attr('href', sprintf('#!/map/incidents/near/%s', (!Seattle911.UI.Settings.AddressEnabled()) ? "me" : Seattle911.UI.Address()));

	$("#locate-icon").click(function() {
		Seattle911.Geocode.Locate();
	});

	$("#fit-to-markers").click(function() {
		Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);	
	});

	Seattle911.UI.CurrentCity(Seattle911.UI.CurrentCity());

	Seattle911.UI.MapInfoWindow = new google.maps.InfoWindow();
	Seattle911.Session.Markers = [];

	// Initialize Cookies
	if (Seattle911.UI.Settings.Distance() == null) {
		Seattle911.UI.Settings.AddressEnabled(false);
		Seattle911.UI.Settings.Distance(1);
		Seattle911.UI.Settings.UOM("mi");
	}

	Seattle911.List.LoadMore(false);
}

Seattle911.Reset = function() {
	clearTimeout(Seattle911.Timer);

	Seattle911.Session.FirstLoad = true;
	Seattle911.Session.ResetMapMarkers();
	Seattle911.List.Clear();
	
	if (Seattle911.Session.Overlays.Neighborhood != undefined)
		Seattle911.Session.Overlays.Neighborhood.setMap(null);

	if (Seattle911.Geocode.Overlay.Radius != undefined)
		Seattle911.Geocode.Overlay.Radius.setMap(null);

	if (Seattle911.Geocode.Overlay.Point != undefined)
		Seattle911.Geocode.Overlay.Point.setMap(null);

	if (Seattle911.Geocode.Overlay.Area != undefined)
		Seattle911.Geocode.Overlay.Area.setMap(null);

	Seattle911.Session.LastFetch = new Date(1, 1, 1, 0, 0, 0);
	Seattle911.Session.FirstFetch = new Date(9999, 12, 31, 23, 59, 59);

	$("#incident_list .container").html(Seattle911.Loading());	

	$("#info").remove();
	$(document).trigger('close.facebox');
}

Seattle911.SetTitle = function(title) {
	$(document).attr("title", title);
	Seattle911.Session.PageTitle = title;
}

Seattle911.UpdateNewIncidentCount = function(diff) {
	Seattle911.Session.NewIncidentCount = Seattle911.Session.NewIncidentCount + diff;
	
	if (Seattle911.Session.NewIncidentCount == 0)
		$(document).attr("title", Seattle911.Session.PageTitle);
	else
		$(document).attr("title", Seattle911.Session.PageTitle + " ("+Seattle911.Session.NewIncidentCount+")");

}

Seattle911.Map.AddIncidents = function(map, incidents) {

	if (incidents == null || incidents.length == 0) {
		if (Seattle911.Session.FirstLoad)
			Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);
		Seattle911.Session.FirstLoad = false;
		$(".loading").remove();
		return;
	}

	var incident = incidents.pop();

	Seattle911.Map.AddIncident(map, incident);

	Seattle911.Map.AddIncidents(map, incidents);
}

Seattle911.Map.AddIncident = function(map, incident) {

	infoWindow = "<div class=\"incident-marker-title\">%s</div><div class=\"incident-marker-body\">%s</div><div class='incident-marker-date'>%s</div><a href=\"#!/incident/%s\" class=\"incident-marker-more link\">more info &raquo;</a>";

	color = (incident.Closed == "false") ? "FE7569" : "DDDDDD"; 

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(incident.Address.Location.Latitude, incident.Address.Location.Longitude),
		title: incident.ID,
		map: map,
		icon: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color, new google.maps.Size(21, 34), new google.maps.Point(0,0), new google.maps.Point(10, 34)),
		shadow: new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow&chld=A", new google.maps.Size(40, 37), new google.maps.Point(0, 0), new google.maps.Point(12, 35))
	});
	
	Seattle911.Session.Markers.push(marker);

	var date = "%s %d, %d %d:%s %s";

	incident.Date = Date.parse(incident.Date);
	incident.Date = new Date(incident.Date);
 
	hours = incident.Date.getHours();
	hours = hours == 0 ? 12 : ((hours > 12) ? hours-12 : hours);
 
	minutes = incident.Date.getMinutes();
	minutes = minutes < 10 ? "0"+minutes : minutes;

	ampm = incident.Date.getHours() >= 12 ? "PM" : "AM";

	months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

	date = sprintf(date, months[incident.Date.getMonth()], incident.Date.getDate(), incident.Date.getFullYear(), hours, minutes, ampm);

	google.maps.event.addListener(marker, 'click', function() {
		type = incident.Type.Name;
		address = incident.Address.FormattedAddress;
		Seattle911.UI.MapInfoWindow.setContent(sprintf(infoWindow, type, address, date, incident.ID, incident.ID, incident.ID));
		Seattle911.UI.MapInfoWindow.open(Seattle911.UI.Map, marker);
	});

}


Seattle911.Loading = function() {
	return "<div class=\"loading\"><img src=\""+Seattle911.rootURL+"img/loading.gif\" /></div>";
}

Seattle911.SmallLoading = function() {
	return "<div class=\"loading-small\"><img src=\""+Seattle911.rootURL+"img/loading_24.gif\" /></div>";
}

Seattle911.Session.ResetMapMarkers = function() {
	for (i in Seattle911.Session.Markers) {
		Seattle911.Session.Markers[i].setMap(null);
	} 
	Seattle911.Session.Markers = [];
}



Seattle911.ZoomToShowAllMarkers = function(map) {
	bounds = new google.maps.LatLngBounds();

	if (Seattle911.Session.Markers.length == 0)
		return;

	for (i in Seattle911.Session.Markers) {
		bounds.extend(Seattle911.Session.Markers[i].position);
	}

	map.fitBounds(bounds);
}


Seattle911.DrawPolygon = function(map, points) {
	if (Seattle911.Session.Overlays.Neighborhood != undefined)
		Seattle911.Session.Overlays.Neighborhood.setMap(null);

	coords = [];
	bounds = new google.maps.LatLngBounds();
	for (i=0; i<points.length; i++) {
		coords[i] = new google.maps.LatLng(points[i].Latitude, points[i].Longitude);
		bounds.extend(coords[i]);

	//	marker = new google.maps.Marker({
	//		position: coords[i],
	//		title: points[i].Order + ": " + coords[i].toUrlValue(),
	//		map: map,
	//	});

	//	Seattle911.Session.Markers.push(marker);
	}

	options = {
		clickable: false,
		fillColor: "green",
		fillOpacity: .2,
		geodesic: true,
		map: map,
		paths: coords,
		strokeColor: "green",
		strokeOpacity: .3,
		strokeWeight: 1
	};

	
	Seattle911.Session.Overlays.Neighborhood = new google.maps.Polygon(options);
	map.fitBounds(bounds);
}
