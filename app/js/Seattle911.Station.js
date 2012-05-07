Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Station = {};

Seattle911.Station.GetAll = function(callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "stations"
			},
			error : function(response) {
				Seattle911.Session.jqXHR = response;
				jQuery(document).trigger('server.error');
			},
			success : function(data) {
				callback(data);
			},
			timeout: 10000,
			type : "GET"
		}
	);
}

Seattle911.Station.Get = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "station",
				id: id
			},
			error : function(response) {
				Seattle911.Session.jqXHR = response;
				jQuery(document).trigger('server.error');
			},
			success : function(data) {
				callback(data);
			},
			timeout: 10000,
			type : "GET"
		}
	);
}

Seattle911.Station.GetHtml = function(id, callback) {
	jQuery.get(Seattle911.rootURL+"/get-html",
		{
			entity: "station",
			id: id
		},
		function(html) {
			// Check the data?
			callback(html);
		}
	);
}

Seattle911.Station.GetIncidents = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "incidents/recent",
				station: id
			},
			error : function(response) {
				Seattle911.Session.jqXHR = response;
				jQuery(document).trigger('server.error');
			},
			success : function(data) {
				callback(data);
			},
			timeout: 10000,
			type : "GET"
		}
	);
}
