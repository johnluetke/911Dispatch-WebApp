<?php
$url = sprintf("http://%s%s/", $_SERVER['HTTP_HOST'], dirname($_SERVER['SCRIPT_NAME']));

function get_uri_address() {
	$address = sprintf("%s %s, %s %s", $_COOKIE['seattle911-address-street'],  $_COOKIE['seattle911-address-city'],  $_COOKIE['seattle911-address-state'],  $_COOKIE['seattle911-address-zip']);

	return urlencode($address);
}
?>
<!DOCTYPE html>
<html xmlns:og="http://ogp.me/ns#">
<head>
	<title>911 Dispatch</title>
	<base href="<?php echo $url;?>" />
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />

	<meta property="og:title" content="911 Dispatch" />
	<meta property="og:type" content="website" />
	<meta property="og:description" content="Wondering what's going on when you hear sirens? 911 Dispatch tells you!" />
	<meta property="og:image" content="<?php echo $url; ?>img/icon.png" />
	<meta property="og:url" content="http://johnluetke.net/seattle911/app" />

	<link href="css/seattle911.css" rel="stylesheet" />
	<link href="css/facebox.css" rel="stylesheet" />
	<link href="css/slider.css" rel="stylesheet" />

	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
	<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
	<script type="text/javascript" src="js/jquery.cookie.js"></script>
	<script type="text/javascript" src="js/modernizr.js"></script>
	<script type="text/javascript" src="js/sprintf.js"></script>
	<script type="text/javascript" src="js/facebox.js"></script>
	<script type="text/javascript" src="js/path.min.js"></script>
	<script type="text/javascript" src="http://cdn.jquerytools.org/1.2.6/form/jquery.tools.min.js"></script>


	<script type="text/javascript" src="js/utility.js"></script>
	<script type="text/javascript" src="js/Seattle911.js"></script>
	<script type="text/javascript" src="js/Seattle911.Action.js"></script>
	<script type="text/javascript" src="js/Seattle911.Address.js"></script>
	<script type="text/javascript" src="js/Seattle911.Area.js"></script>
	<script type="text/javascript" src="js/Seattle911.Constants.js"></script>
	<script type="text/javascript" src="js/Seattle911.Geocode.js"></script>
	<script type="text/javascript" src="js/Seattle911.Incidents.js"></script>
	<script type="text/javascript" src="js/Seattle911.List.js"></script>
	<script type="text/javascript" src="js/Seattle911.Station.js"></script>
	<script type="text/javascript" src="js/Seattle911.UI.js"></script>
	<script type="text/javascript" src="js/Seattle911.Unit.js"></script>
	<script src="http://platform.twitter.com/widgets.js" type="text/javascript"></script>

	<script type="text/javascript">

	$.facebox.settings.closeImage = 'img/closelabel.png';
	$.facebox.settings.loadingImage = 'img/loading.gif';

	$(document).ready(function(){

		Seattle911.Session.LastFetch = new Date(1, 1, 1, 0, 0, 0);
		Seattle911.Session.FirstFetch = new Date(9999, 12, 31, 23, 59, 59);

		Seattle911.rootURL = "<?php echo $url;?>";

		//$(document).bind('close.facebox', function() { history.back(1); });
		$(document).bind('server.error', function() {
			Seattle911.List.Loading(false);
			Seattle911.List.Clear();
			errorMsg = "";

			switch (Seattle911.Session.jqXHR.statusText) {
				case "timeout":
					errorMsg = "Whoops! Our server is taking too long to respond. Could you please try again in about 60 seconds?";
					break;
				default:
					errorMsg = "Whoops! We were unable to process your request. Please try again in 60 seconds.";
					break;
			}
			Seattle911.List.Error(errorMsg);
		});

		$("#city-selector select").change(function() {
			if ($(this).val() == "AddNewCity") {
				html = $("#add_new_city").html();
				$("#add_new_city").remove();
				jQuery.facebox(html);

				$('#add_new_city_form').submit(function() {
					jQuery.post(Seattle911.rootURL + "/add-city",
						{ data: $(this).serializeArray() },
						function(data) {
							jQuery(document).trigger('close.facebox');
							$("#city-selector select").val("SEA");
							$("body").append(sprintf("<div id='add_new_city'>%s</form>", html));
						}
					);
					return false;
				});
			}
		});

		
		$(window).resize(function() {

			Seattle911.Screen.Width = $(window).width();
			Seattle911.Screen.Height = $(window).height();

			$("#city_map").css('width', Seattle911.Screen.Width - Seattle911.List.Width);
			$("#city_map").css('height', Seattle911.Screen.Height - $("#header").height());
			$("#incident_list").css('height', Seattle911.Screen.Height - $("#header").height());


		});

		// FB Like button
		(function(d){
			var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
			d.getElementsByTagName('head')[0].appendChild(js);
		}(document));

		// Initialize Cookies
		if (Seattle911.UI.Settings.Distance() == null) {
			Seattle911.UI.Settings.AddressEnabled(false);
			Seattle911.UI.Settings.Distance(1);
			Seattle911.UI.Settings.UOM("mi");
		}

		Seattle911.Initialize();
		//Seattle911.List.FetchRecentIncidents();

		Path.listen();

	});
	</script>

	<script type="text/javascript">
	// Analytics
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-25631936-1']);
	_gaq.push(['_trackPageview']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();

	// +1
	(function() {
		var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
		po.src = 'https://apis.google.com/js/plusone.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();
	</script>

</head>
<body>
	<div id="header">
		<div id="list-selector">
			<ul class="horizontal">
				<li id="list-selector-recent" class="click active"><a title="Show recent Calls throughout the city" href="#!/map/incidents/recent">Recent</a></li>
				<li id="list-selector-nearby" class="click"><a title="Show recent Calls near my location" href="#!/map/incidents/near/<?php echo ($_COOKIE['seattle911-address-enabled'] == "false") ? "me" : get_uri_address();?>">Nearby</a></li>
				<li id="list-selector-stations" class="click"><a title="Show all stations" href="#!/map/stations">Stations</a></li>
				<li id="list-selector-area" class="click"><a title="Show all Calls in a neighborhood" href="#!/map/neighborhoods">Neighborhoods</a></li>
			</ul>
		</div>
		<a id="settings-icon" class="click" title="Settings" href="#!/settings"><span>Settings</span></a>
		<a id="locate-icon" title="Show my location on the map" class="click"><span>Locate</span></a>

		<div id="current-city">911 Dispatch &raquo; <span id="city-name">Seattle</span></div>
		<div id="fb-root"></div>
		<div class="fb-like" data-href="https://www.facebook.com/pages/Seattle-911/212553615471003" data-send="false" data-layout="button_count" data-width="100" data-show-faces="false"></div>
		<div id="google-plusone">
			<g:plusone href="http://johnluetke.net/seattle911/app"></g:plusone>
		</div>
		<a href="http://twitter.com/Seattle911App" class="twitter-follow-button" data-button="grey" data-text-color="#FFFFFF" data-link-color="#00AEFF" data-show-count="false"></a>
	</div>
	<div id="incident_list">
		<div class="container"></div>
		<div id="loadMore">Load More</div>
	</div>
	<div id="city_map"></div>
	<div id="custom-map-controls">
		<div id="fit-to-markers"></div>
	</div>
</body>
</html>
