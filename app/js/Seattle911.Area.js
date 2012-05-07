Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Area = {};

Seattle911.Area.GetAll = function(callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "area"
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

Seattle911.Area.Get = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "area",
				id: id,
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

Seattle911.Area.GetHtml = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-html",
		{
			data : {
				entity: "area",
				id: id,
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

Seattle911.Area.GetIncidents = function(id, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "incidents/recent/"+id
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
