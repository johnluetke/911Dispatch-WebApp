Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Incidents = {};

Seattle911.Incidents.NearLocation = function(lat, lng, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "incidents/recent",
				latitude: lat,
				longitude: lng,
				distance: Seattle911.UI.Settings.Distance(),
				uom: Seattle911.UI.Settings.UOM()
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
