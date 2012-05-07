Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Unit = {};

Seattle911.Unit.Get = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "unit",
				id: id
			},
			error : function(response) {
				Seattle911.Session.jqXHR = response;
				jQuery(document).trigger('server.error');
			},
			success : function(data) {
				callback(data.response[0]);
			},
			timeout: 10000,
			type : "GET"
		}
	);
}

Seattle911.Unit.GetHtml = function(id, callback) {
	jQuery.get(Seattle911.rootURL+"/get-html",
		{
			entity: "unit",
			id: id
		},
		function(html) {
			// Check the data?
			callback(html);
		}
	);
}

Seattle911.Unit.GetIncidents = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "incidents/recent",
				unit: id
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
