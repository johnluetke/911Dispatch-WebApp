Seattle911 = Seattle911 ? Seattle911 : {};
Seattle911.UI = {};
Seattle911.UI.Settings = {}

Seattle911.UI.Settings.Expire = new Date('December 31, 2038 23:59:59');

Seattle911.UI.CurrentCity = function(val) {
	if (val == undefined) 
		return jQuery.cookie('seattle911-city-name');
	else {
		jQuery("span#city-name").html(val);

		jQuery.cookie('seattle911-city-name', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);

	}
}

Seattle911.UI.Nearby = function(val) {
	jQuery("#list-selector-nearby a").attr("href", "./map/incidents/near/"+val);
}

Seattle911.UI.Settings.HasAddress = function() {
	return (
		(Seattle911.UI.Settings.AddressStreet != "") &&
		(Seattle911.UI.Settings.AddressCity != "") &&
		(Seattle911.UI.Settings.AddressState != "") &&
		(Seattle911.UI.Settings.AddressZIP != "")
	);
}

Seattle911.UI.Address = function() {
	return sprintf("%s %s, %s %s", Seattle911.UI.Settings.AddressStreet(), Seattle911.UI.Settings.AddressCity(), Seattle911.UI.Settings.AddressState(), Seattle911.UI.Settings.AddressZIP());
}

Seattle911.UI.Settings.Distance = function(val) {
	if (val == undefined) 
		return jQuery.cookie('seattle911-distance');
	else {
		val = val * 1;
		val = val.toFixed(1);
		jQuery("span#distance-value").html(val);

		jQuery.cookie('seattle911-distance', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.UOM = function(val, name) {
	if (val === undefined)
		return jQuery.cookie('seattle911-uom');
	else {
		$("select#uom").val(val);
		//Seattle911.UI.CurrentCity(name);

		jQuery.cookie('seattle911-uom', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.Show = function() {
	Seattle911.UI.Block(Seattle911.Loading());
}

Seattle911.UI.Settings.ToggleNewCity = function() {
	jQuery("fieldset#add-new-city").toggle();
}

Seattle911.UI.Settings.SubmitNewCity = function() {
	city = $("input#new-city-name").val();
	state = $("input#new-state-name").val();

	if (city == "" || state == "")
		alert("Please enter both a City and State");
	else {
		jQuery.post(Seattle911.rootURL + "/add-city",
			{ 
				data : [
					{name: "city", value: city},
					{name: "state", value: state}
				]
			},
			function(data) {
				alert("You're request has been recieved. Thank you!");
				Seattle911.UI.Settings.ToggleNewCity();
			}
		);
	}
}

Seattle911.UI.Settings.City = function(val, name) {
	if (val === undefined)
		return jQuery.cookie('seattle911-city');
	else {
		$("select#city").val(val);
		Seattle911.UI.CurrentCity(name);
		Seattle911.UI.Nearby(Seattle911.UI.Address());

		jQuery.cookie('seattle911-city', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.ProximityEnabled = function(val) {
	if (val === undefined)
		return jQuery.cookie('seattle911-proximity-enabled') == "true";
	else if (val == true || val == false) {
		$("input#proximityEnabled").prop('checked', val);

		$("select#uom").prop('disabled', !val);
		$("input#distance").prop('disabled', !val);

		if (val) {
			$("span#distance-value").removeClass('disabled');
			$("input#distance").removeClass('disabled');
		}
		else {
			$("span#distance-value").addClass('disabled');
			$("input#distance").addClass('disabled');
		}


		jQuery.cookie('seattle911-proximity-enabled', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.AddressEnabled = function(val) {
	if (val === undefined)
		return jQuery.cookie('seattle911-address-enabled') == "true";
	else if (val == true || val == false) {
		$("input#addressEnabled").prop('checked', val);

		$("input#streetAddress").prop('disabled', !val);
		$("input#addressCity").prop('disabled', !val);
		$("input#addressState").prop('disabled', !val);
		$("input#addressZIP").prop('disabled', !val);

		Seattle911.UI.Nearby(val ? Seattle911.UI.Address() : "me");

		jQuery.cookie('seattle911-address-enabled', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.AddressStreet = function(val) {
	if (val === undefined)
		return jQuery.cookie('seattle911-address-street');
	else {
		if (Seattle911.UI.Settings.AddressEnabled())
			Seattle911.UI.Nearby(val);

		jQuery.cookie('seattle911-address-street', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.AddressCity = function(val) {
	if (val === undefined)
		return jQuery.cookie('seattle911-address-city');
	else {
		Seattle911.UI.Nearby(Seattle911.UI.Address());

		jQuery.cookie('seattle911-address-city', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.AddressState = function(val) {
	if (val === undefined)
		return jQuery.cookie('seattle911-address-state');
	else {
		val = val.toUpperCase();
		Seattle911.UI.Nearby(Seattle911.UI.Address());

		$("input#addressState").val(val);

		jQuery.cookie('seattle911-address-state', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}

Seattle911.UI.Settings.AddressZIP = function(val) {
	if (val === undefined)
		return jQuery.cookie('seattle911-address-zip');
	else {
		Seattle911.UI.Nearby(Seattle911.UI.Address());

		jQuery.cookie('seattle911-address-zip', val, 
			{ 
				expires: Seattle911.UI.Settings.Expire,
				raw: true
			}
		);
	}
}



Seattle911.UI.Block = function (content) {
	jQuery.facebox(function() {
		jQuery.get(Seattle911.rootURL + "get-html",
			{
				form: "settings"
			},
			function(html) {
				jQuery.facebox(html);
				$("input#distance").rangeinput();
			}
		);
	});

}

