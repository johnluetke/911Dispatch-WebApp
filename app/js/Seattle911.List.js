Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.List = Seattle911.List ? Seattle911.List : {};

Seattle911.List.Width = 320;

Seattle911.List.Clear = function() {
	$("#incident_list .container").html("");
}

Seattle911.List.Error = function(message) {
	$("#incident_list .container").html("<div class='error'>"+message+"</div>");
}

Seattle911.List.Loading = function(loading) {
	if (loading) $("#list").html(Seattle911.Loading());
	else $("#list .loading").remove();
}

Seattle911.List.LoadMore = function(show) { if (show) { $("#loadMore").show(); } else { $("#loadMore").hide(); } }
Seattle911.List.LoadMoreClick = function(callback) { $("#loadMore").click(callback); }
Seattle911.List.LoadMoreVisible = function() { return ($("#loadMore:visible").length > 0); }

Seattle911.List.Selector = {};
Seattle911.List.Selector.Clear = function() { $("#list-selector li").each(function() { 
	$(this).removeClass("active"); });
}
Seattle911.List.Selector.Set = function(id) {
	$("#list-selector li").click(function() {
		if ($(this).hasClass("active"))
			return;

		$("#list-selector li").each(function() {
			$(this).removeClass("active");
		});
		$("#info").remove();
	});

	if (id !== undefined) {
		$("#list-selector li").each(function() {
			$(this).removeClass("active");
		});
		$("#list-selector #"+id).addClass("active");
	}
}

Seattle911.List.AddArea = function(areas, position) {

	if (areas == null || areas.length == 0) {
		//Seattle911.List.Loading(false);
		$(".loading").remove();
		return;
	}

	var area = (position =="top") ? areas.pop() : areas.shift();

	html ="<a id='area-%s' href='#!/map/neighborhood/%s' class='area %s' style=''><div class='title'>%s</div></a>";
	html = sprintf(html, area.ID, area.Slug, area.Slug, area.Name);

	if (position == "top") 
		$("#incident_list .container").prepend(html);
	else
		$("#incident_list .container").append(html);

	//Seattle911.DrawPolygon(Seattle911.UI.Map, area.Bounds);
	Seattle911.List.AddArea(areas, position);
}

Seattle911.List.AddStation = function(stations, position) {
	if (stations == null || stations.length == 0) {
		$(".loading").remove();
		return;
	}

	var station = (position == "top") ? stations.pop() : stations.shift();

	html = "<a href='#!/map/station/%s' id='station-%s' data-stationID='%s' class='station' style=''><div class='title'>%s</div>    <div class='subtitle'>%s</div><div class='unit'>%s units</div></a>";
	infoWindow = "<div class=\"station-marker-title\">%s</div><div class=\"station-marker-body\">%s</div><a href=\"#!/station/%s\" class=\"station-marker-more link\">more info &raquo;</a>";

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(station.Address.Location.Latitude, station.Address.Location.Longitude),
		title: station.ID,
		map: Seattle911.UI.Map
	});

	Seattle911.Session.Markers.push(marker);

	google.maps.event.addListener(marker, 'click', function() {
		name = station.Name;
		address = station.Address.FormattedAddress;
		Seattle911.UI.MapInfoWindow.setContent(sprintf(infoWindow, name, address, station.ID, station.ID, station.ID));
		Seattle911.UI.MapInfoWindow.open(Seattle911.UI.Map, marker);
	});

	html = sprintf(html, station.ID, station.ID, station.ID, station.Name, station.Address.FormattedAddress, station.Units);
	
	if ("top" == position) {
		$("#incident_list .container").prepend(html);
	}
	else {
		$("#incident_list .container").append(html);
	}

	$("#station-"+station.ID).click(function() {

		if ($(this).hasClass("selected")) {
			// show the popup
			Seattle911.Action.Set(['station',station.ID]);
		}
		else {
			for (m in Seattle911.Session.Markers) {
				if (station.ID == Seattle911.Session.Markers[m].title) {
					// Remove the selected class from all elements
					$("#incident_list .container .station").each(function(){
						$(this).removeClass('selected');
					});

					// Add it to the new item
					$(this).addClass('selected');
	
					Seattle911.UI.Map.panTo(new google.maps.LatLng(station.Address.Location.Latitude, station.Address.Location.Longitude));
					google.maps.event.trigger(Seattle911.Session.Markers[m], 'click');
					break;
				}
			}
		}
	});

	Seattle911.List.AddStation(stations, position);

}

Seattle911.List.AddIncidents = function(incidents, position) {

	if (incidents == null || incidents.length == 0) {
		if (Seattle911.Session.FirstLoad)
			Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);
		Seattle911.Session.FirstLoad = false;
		$(".loading").remove();
		return;
	}

	var incident = (position == "top") ? incidents.pop() : incidents.shift();

	date = "%s %d, %d %d:%s %s";
	html = "<a href='#!/map/incident/%s' id='%s' class='incident %s' style='display: none;'><div class='title'>%s</div><div class='subtitle'>%s</div><div class='date'>%s</div></a>";

	incident.Date = Date.parse(incident.Date);
	incident.Date = new Date(incident.Date);
 
	hours = incident.Date.getHours();
	hours = hours == 0 ? 12 : ((hours > 12) ? hours-12 : hours);
 
	minutes = incident.Date.getMinutes();
	minutes = minutes < 10 ? "0"+minutes : minutes;

	ampm = incident.Date.getHours() >= 12 ? "PM" : "AM";

	months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

	date = sprintf(date, months[incident.Date.getMonth()], incident.Date.getDate(), incident.Date.getFullYear(), hours, minutes, ampm);
 
	html = sprintf(html, incident.ID, incident.ID, (incident.Closed == "false") ? "open" : "closed" , incident.Type.Name, incident.Address.FormattedAddress, date);

	Seattle911.Map.AddIncident(Seattle911.UI.Map, incident);

	if ("top" == position) {
		$("#incident_list .container").prepend(html);
		if (!Seattle911.Session.FirstLoad) {
			$("#"+incident.IncidentID).addClass("new-incident");
			$("#"+incident.IncidentID+" > .date").before("<div class='incident-overlay'></div>");
			Seattle911.UpdateNewIncidentCount(1);
		}
	}
	else {
		$("#incident_list .container").append(html);
	}
	
	$("#"+incident.ID).fadeIn(Seattle911.Session.FirstLoad ? 0 : 600, function() {
		if (incidents.length == 0)
			$("#loadMore").html("Load More");
			
		if ("top" != position)
			$("#incident_list").animate({ scrollTop: $("#incident_list").attr('scrollHeight') }, 0);
			Seattle911.List.AddIncidents(incidents, position);	
	});
}

Seattle911.List.Fetch = function(before, after, position) {
	jQuery.get(Seattle911.rootURL+"/get-data",
		{
			entity: "incidents/recent",
			before: before,
			after: after,
			limit: 40
			
		},
		function(data) {
			if (data == null || data == undefined) return;
			//var data = jQuery.parseJSON(data);
 
			// check the repsonse headers
 
			// Get the last update time;
			for (i in data) {
				var d = Date.parse(data[i].Date);
				d = new Date(d);
	
				// Update the last fetch data only if more recent
				if (d > Seattle911.Session.LastFetch)
					Seattle911.Session.LastFetch = d;

				// Update the first fetch date if earlier
				if (d < Seattle911.Session.FirstFetch)
					Seattle911.Session.FirstFetch = d;
			}

			// Pass the new incidents for UI Update
			Seattle911.List.AddIncidents(data, position);
		}
	);
}


Seattle911.List.FetchAreas = function() {
	clearTimeout(Seattle911.Timer);
	Seattle911.Session.ResetMapMarkers();
	Seattle911.List.Clear();
	$("#loadMore").hide();
	$("#incident_list .container").html(Seattle911.Loading());
	Seattle911.Area.GetAll(function(areas) {
		Seattle911.List.AddArea(areas, "bottom");
	});
}


Seattle911.List.FetchRecentIncidents = function() {
	var d = Seattle911.Session.LastFetch;

	var since = d.getUTCFullYear()+"-";
	since += d.getUTCMonth()+1+"-";
	since += d.getUTCDate()+" ";
	since += d.getUTCHours()+":";
	since += d.getUTCMinutes()+":";
	since += d.getUTCSeconds();
 
	Seattle911.List.Fetch("9999-12-31 23:59:59", since, "top");
 
	if (!Seattle911.List.LoadMoreVisible())
		Seattle911.List.LoadMore(true);

	Seattle911.Timer = setTimeout("Seattle911.List.FetchRecentIncidents()", 5000);
}


Seattle911.List.FetchStations = function() {
	clearTimeout(Seattle911.Timer);
	Seattle911.Session.ResetMapMarkers();
	Seattle911.List.Clear();
	$("#loadMore").hide();
	$("#incident_list .container").html(Seattle911.Loading());
	Seattle911.Station.GetAll(function(stations) {
		Seattle911.List.AddStation(stations, "bottom");
		Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);
	});
}

