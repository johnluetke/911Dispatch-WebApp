Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Action = {};

Seattle911.Action.Signifier = "#!";

Seattle911.Action.GA = function() {
	_gaq.push(['_trackPageview', document.location.hash]);
}

$("a").live("click", function() {
	href = $(this).attr("href");
	if (href !== undefined && href[0] == "." && href[1] == "/") {
		// IE 8 fix
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
		// substring(1) will remove the "."
		window.location.hash = "#!" + href.substring(1);
		return false;
	}
});

Path.map("#!/map/incidents/recent").enter(Seattle911.Action.GA).to(function() {
	Seattle911.Reset();
	Seattle911.List.Selector.Set("list-selector-recent");
	Seattle911.List.Loading();
	$("#list-selector-recent").addClass("active");
	Seattle911.SetTitle("911 Dispatch » Recent Incidents");

	Seattle911.List.FetchRecentIncidents();
});

Path.map("#!/map/incidents/station/:stationID").enter(Seattle911.Action.GA).to(function() {
	var stationID = this.params['stationID'];
	
	Seattle911.Reset();
	Seattle911.List.Loading();
	Seattle911.List.Selector.Set("list-selector-stations");
	Seattle911.SetTitle(sprintf("911 Dispatch » Station %s", stationID));

	Seattle911.Station.GetIncidents(stationID, function(incidents) {
		Seattle911.Station.Get(stationID, function(station) {
			Seattle911.List.AddIncidents(incidents);
			Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);

			$("#info").remove();
			$("#city_map").append(sprintf("<div id='info'>Only showing incidents that %s responded to. <a href='./map/incidents/recent' class='link' id='showAll'>Show All Incidents</a></div>", station.Name));
			$("#info").css('left', ($("#city_map").width() - $("#info").width()) / 2);

			Seattle911.List.LoadMore(false);
		});
	});
});

Path.map("#!/map/incidents/near/:location").enter(Seattle911.Action.GA).to(function() {
	var loc = this.params['location'];
	var locate = loc == "me";
	
	Seattle911.Reset();
	Seattle911.List.Loading();
	Seattle911.List.Selector.Set("list-selector-nearby");
	Seattle911.SetTitle(sprintf("911 Dispatch » Incidents near %s", loc));
	Seattle911.Geocode.Locate(loc, function(incidents) {
		Seattle911.List.AddIncidents(incidents);
		Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);
	
		$("#info").remove();
		$("#city_map").append(sprintf("<div id='info'>Only showing incidents within %s %s of %s. <a href='./map/incidents/recent' class='link' id='showAll'>Show All Incidents</a></div>", Seattle911.UI.Settings.Distance(), Seattle911.UI.Settings.UOM(), loc == "me" ? "you" : Seattle911.UI.Settings.AddressStreet()));
		$("#info").css('left', ($("#city_map").width() - $("#info").width()) / 2);
	
		Seattle911.List.LoadMore(false)
	});
});

Path.map("#!/map/incidents/near/:location/within/:distance/:unit").enter(Seattle911.Action.GA).to(function() {
	var loc = this.params['location'];
	var distance = this.params['distance'];
	var unit = this.params['unit'];

	var locate = loc == "me";


	Seattle911.Reset();
	Seattle911.List.Loading();
	//Seattle911.List.Selector.Set("list-selector-stations");
	Seattle911.SetTitle(sprintf("911 Dispatch » Incidents near %s (%s %s)", loc, distance, unit));
});

Path.map("#!/map/incidents/between/:date1/and/:date2").enter(Seattle911.Action.GA).to(function() {
	var earlyDate = this.params['date1'];
	var lateDate = this.params['date2'];

	Seattle911.Reset();
	Seattle911.List.Loading();
	//Seattle911.List.Selector.Set("list-selector-stations");
	Seattle911.SetTitle(sprintf("911 Dispatch » Incidents between %s and %s", loc, distance, unit));
});


Path.map("#!/map/stations").enter(Seattle911.Action.GA).to(function() {
	Seattle911.Reset();
	Seattle911.List.Selector.Set("list-selector-stations");
	Seattle911.SetTitle("911 Dispatch » Stations");

	Seattle911.List.FetchStations();
});

Path.map("#!/map/neighborhoods").enter(Seattle911.Action.GA).to(function() {
	Seattle911.Reset();
	Seattle911.List.Selector.Set("list-selector-area");
	Seattle911.SetTitle("911 Dispatch » Neighborhoods");	

	Seattle911.List.FetchAreas();
});


Path.map("#!/map/station/:stationID").enter(Seattle911.Action.GA).to(function() {
	var stationID = this.params['stationID'];
	Seattle911.SetTitle(sprintf("911 Dispatch » Station %s", stationID));	

	for (m in Seattle911.Session.Markers) {
		if (stationID == Seattle911.Session.Markers[m].title) {
			// Remove the selected class from all elements
			$("#incident_list .container .station").each(function(){
				$(this).removeClass('selected');
				$(this).attr("href", sprintf("./map/station/%s", $(this).attr("data-stationID")));
			});

			$(sprintf("#station-%s", stationID)).attr("href", sprintf("./station/%s", stationID));

			// Add it to the new item
			$(sprintf("#%s", stationID)).addClass('selected');
	
			Seattle911.UI.Map.panTo(Seattle911.Session.Markers[m].getPosition());
			google.maps.event.trigger(Seattle911.Session.Markers[m], 'click');
			break;
		}
	}
});

Path.map("#!/map/unit/:unitID").enter(Seattle911.Action.GA).to(function() {
	var unitID = this.params['unitID'];
	Seattle911.SetTitle(sprintf("911 Dispatch » %s", unitID));

	Seattle911.Reset();
	Seattle911.List.Loading(true);
	Seattle911.Unit.GetIncidents(unitID, function(incidents) {
		Seattle911.List.AddIncidents(incidents);
		Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);
		
		$("#info").remove();
		$("#city_map").append(sprintf("<div id='info'>Only showing incidents that %s responded to. <a href='./map/incidents/recent' class='link' id='showAll'>Show All Incidents</a></div>", unitID));
		$("#info").css('left', ($("#city_map").width() - $("#info").width()) / 2);

		Seattle911.List.Selector.Clear();
		Seattle911.List.LoadMore(false);
	
	});
});

Path.map("#!/map/incident/:incidentID").enter(Seattle911.Action.GA).to(function() {
	var incidentID = this.params['incidentID'];
	Seattle911.SetTitle(sprintf("911 Dispatch » %s", incidentID));

	for (m in Seattle911.Session.Markers) {
		if (incidentID == Seattle911.Session.Markers[m].title) {
			// Remove the selected class from all elements
			$("#incident_list .container .incident").each(function(){
				$(this).removeClass('selected');
				$(this).attr("href", sprintf("#!/map/incident/%s", $(this).attr("id")));
			});

			$(sprintf("#%s", incidentID)).attr("href", sprintf("#!/incident/%s", incidentID));

			// Add it to the new item
			$(sprintf("#%s", incidentID)).addClass('selected');

			if ($(sprintf("#%s", incidentID)).hasClass('new-incident'))
				Seattle911.UpdateNewIncidentCount(-1);
	
			$(sprintf("#%s", incidentID)).removeClass("new-incident");
			$("#"+incidentID+" .incident-overlay").remove();
	
			Seattle911.UI.Map.panTo(Seattle911.Session.Markers[m].getPosition());
			google.maps.event.trigger(Seattle911.Session.Markers[m], 'click');
			break;
		}
	}
});

Path.map("#!/incident/:incidentID").enter(Seattle911.Action.GA).to(function() {
	var incidentID = this.params['incidentID'];
	Seattle911.SetTitle(sprintf("911 Dispatch » %s", incidentID));

	$.facebox(function() {
		$.get(Seattle911.rootURL + "/get-html",
			{
				entity: "incident",
				id: incidentID
			},
			function(data) {
				$.facebox(data);
			}
		);
	});
	
});

Path.map("#!/unit/:unitID").enter(Seattle911.Action.GA).to(function() {
	var unitID = this.params['unitID'];
	Seattle911.SetTitle(sprintf("911 Dispatch » %s", unitID));


	$.facebox(function() {
		$.get(Seattle911.rootURL+"/get-html",
			{
				entity: "unit",
				id: unitID
			},
			function(data) {
				$.facebox(data);
			}
		);
	});
});

Path.map("#!/station/:stationID").enter(Seattle911.Action.GA).to(function() {
	var stationID = this.params['stationID'];

	Seattle911.SetTitle(sprintf("911 Dispatch » Station %s", stationID));

	$.facebox(function() {
		$.get(Seattle911.rootURL+"/get-html",
			{
				entity: "station",
				id: stationID
			},
			function(data) {
				$.facebox(data);	
			}
		);
	});
});


Path.map("#!/map/neighborhood/:areaName").enter(Seattle911.Action.GA).to(function() {
	var areaName = this.params['areaName'];

	Seattle911.List.Selector.Set("list-selector-area");

	$(".selected-area-loading").remove();
	$(".area.selected").removeClass("selected");

	//$(sprintf(".area.%s", areaName)).addClass("selected");
	//$(sprintf(".area.%s > .title", areaName)).before("<img class='selected-area-loading' src='img/loading_24.gif' />");

	Seattle911.Reset();
	Seattle911.List.Loading();
	
	Seattle911.Area.GetIncidents(areaName, function(incidents) {
		Seattle911.Area.Get(areaName, function(area) {

			Seattle911.SetTitle(sprintf("911 Dispatch » %s", area.Name)); 

			Seattle911.List.AddIncidents(incidents);
			Seattle911.DrawPolygon(Seattle911.UI.Map, area.Bounds);

			Seattle911.ZoomToShowAllMarkers(Seattle911.UI.Map);

			$("#info").remove();
			$("#city_map").append(sprintf("<div id='info'>Only showing incidents that occured in %s. <a href='./map/incidents/recent' class='link' id='showAll'>Show All Incidents</a></div>", area.Name));
			$("#info").css('left', ($("#city_map").width() - $("#info").width()) / 2);

			Seattle911.List.LoadMore(false);
		});
	});
});

Path.map("#!/settings").enter(Seattle911.Action.GA).to(function() {
	Seattle911.SetTitle(sprintf("911 Dispatch » %s", "Settings"));
	Seattle911.UI.Settings.Show();
});

Path.root("#!/map/incidents/recent");

Path.rescue(function() {
	// If the user hits an unknown route, send them to the default
	document.location.hash = Path.routes.root;
});
