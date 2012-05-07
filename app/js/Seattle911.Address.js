Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.Address = {};

Seattle911.Address.Geocode = function(address, callback) {
	jQuery.ajax(
		Seattle911.rootURL+"/get-data",
		{
			data : {
				entity: "geocode",
				address: address
			},
			error : function(response) {
				Seattle911.Session.jqXHR = response;
				jQuery(document).trigger('server.error');
			},
			success : function(data) {
				callback(data.response);
			},
			timeout: 10000,
			type : "GET"
		}
	);
}
