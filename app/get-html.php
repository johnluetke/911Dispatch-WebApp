<?php
date_default_timezone_set('America/Los_Angeles');
$url = sprintf("http://%s%s/", $_SERVER['HTTP_HOST'], dirname($_SERVER['SCRIPT_NAME']));

switch ($_REQUEST['entity']) {
	case "station":
		echo Station($_REQUEST['id']);
		break;
	case "incident":
		echo Incident($_REQUEST['id']);
		break;
	case "unit":
		echo Unit($_REQUEST['id']);
		break;
	default:
		switch ($_REQUEST['form']) {
			case "settings":
				echo Settings();
				break;
		}
		break;
}

function Unit($id) {

	global $url;

	$unit = file_get_contents(sprintf($url . "/get-data?entity=unit/details&id=%s", $id));
	$unit = json_decode($unit);

	ob_start();
?>
<div id="unit-<?php echo $unit->ID;?>" class="modal centered">
	<div class="left">
		<h1 id="unit-title" unit-UnitID="<?php echo $unit->ID;?>"><?php echo $unit->ID;?><?php echo !empty($unit->Name) ? sprintf(" (%s)", $unit->Name) : "";?></h1>
		<a href="#!/station/<?php echo $unit->Station->ID;?>" id="unit-station" class="link" unit-stationID="<?php echo $unit->Station->ID;?>"><?php echo $unit->Station->Name;?></a>
		<ul>
			<li><a href="#!/map/unit/<?php echo $unit->ID;?>" class="link" id="showIncidents">Show incidents <?php echo $unit->ID;?> responded to</li>
		</ul>
	</div>
	<div class="right">

	</div>
</div>
<?php
	$html = ob_get_contents();
	ob_end_clean();

	return $html;
}

function Incident($id) {
	
	global $url;

	$data = file_get_contents(sprintf($url . "/get-data?entity=incident/details/%s", $id));
	$data = json_decode($data);

	ob_start();
?>
<div id="incident-<?php echo $id;?>" class="modal centered">
	<div class="left">
		<h1 id="incident-title" data-incidentID="<?php echo $id;?>"><?php echo $data->Type->Name;?></h1>
		<span id="incident-address" class="address" data-latitude="<?php echo $data->Address->Location->Latitude;?>" data-longitude="<?php echo $data->Address->Location->Longitude;?>"><?php echo $data->Address->FormattedAddress;?></span>
		<span id="incident-time" class="time" data-timestamp="<?php echo strtotime($data->Date);?>"><?php echo date("m/d/Y g:i A", strtotime($data->Date));?></span>

			<div class="incident-description"><?php echo $data->Type->Description;?></div>

		<span class="bold">Responding Units</span>
		<ul id="responding-units" class="units">
<?php
	foreach ($data->RespondingUnits as $unit) {
?>			<li><a href="#!/unit/<?php echo $unit->ID;?>" id="unit-<?php echo $unit->ID;?>" class="unit link"><?php echo $unit->ID;?> - <?php echo $unit->Name;?></a></li>
<?php
	} 
?>		
		</ul>
	</div>
	<div class="right">
		<img id="incident_map" src="http://maps.googleapis.com/maps/api/staticmap?size=250x250&center=<?php echo $data->Address->Location->Latitude;?>,<?php echo $data->Address->Location->Longitude;?>&markers=color:red|<?php echo $data->Address->Location->Latitude;?>,<?php echo $data->Address->Location->Longitude;?>&scale=2&sensor=false" />
	</div>
</div>
<?php
	$html = ob_get_contents();
	ob_end_clean();

	return $html;
}

function Settings() {
	require("code/Form.php");
?>
<div id="settings">
	<div class="info">Your settings will be saved automatically.</div>
	<form name="settings">
		<?php 
		echo Form::makeDropdown(
			array(
				"name"=>"city",
				"required"=>true, 
				"label"=>"City",
				"default"=>false,
				"onchange"=>"Seattle911.UI.Settings.City(this.value, this[this.selectedIndex].label);",
				"selected"=>$_COOKIE['seattle911-city']
			),
			array(
				//array(
				//	"name" => "Indiana",
				//	"options" => array(
				//		"ind" => "Indianapolis"
				//	)
				//),
				//array(
				//	"name" => "Oregon",
				//	"options" => array(
				//		"pdx"=>"Portland"
				//	)
				//),
				array(
					"name" => "Washington",
					"options" => array(
						"sea"=>"Seattle"
					)
				)
			)
		);
		?>
		<a class='really-small click' onclick='Seattle911.UI.Settings.ToggleNewCity();'>(Request a New City)</a>
		<fieldset id="add-new-city" class="hidden thin-border rounded-10">
			<label>Request a New City</label>
			<p/>
			<p class="really-small">Submitting a new city does not guarantee that will be included. We will ask and make every effort to work with your city officals to publish 911 calls in real time.</p>
			<?php
			echo Form::makeInput(
				array(
					"name"=>"new-city-name",
					"placeholder"=>"City",
				)
			);
			?>
			<?php
			echo Form::makeInput(
				array(
					"name"=>"new-state-name",
					"placeholder"=>"State",
					"class"=>"no-margin",
					"size"=>2,
					"maxlength"=>2
				)
			);
			?>
			<p/>
			<input type="button" class="rounded-10 click full-width no-border okay" value="Submit New City" onclick="Seattle911.UI.Settings.SubmitNewCity();"/>
		</fieldset>
		</p>
		Nearby incidients are within:<br/>
		<?php
		echo Form::makeInput(
			array(
				"type"=>"range",
				"name"=>"distance",
				"min"=>0.5,
				"max"=>10,
				"step"=>0.1,
				"value"=>$_COOKIE['seattle911-distance'],
				"onchange"=>"Seattle911.UI.Settings.Distance(this.value)",
				"disabled"=>$_COOKIE['seattle911-proximity-enabled'] == "false",
			)
		);
		?>
		<?php
		echo Form::makeDropdown(
			array(
				"name"=>"uom",
				"required"=>true, 
				"onchange"=>"Seattle911.UI.Settings.UOM(this.value, this[this.selectedIndex].label);",
				"selected"=>$_COOKIE['seattle911-uom'],
				"disabled"=>$_COOKIE['seattle911-proximity-enabled'] == "false",
			),
			array (
				"km"=>"Kilometers",
				"mi"=>"Miles"
			)
		);
		?>
		</p>
		<?php
		echo Form::makeCheckbox(
			array(
				"name"=>"addressEnabled",
				"label"=>"Use an address rather than my location",
				"checked"=>$_COOKIE['seattle911-address-enabled'],
				"onclick"=>"Seattle911.UI.Settings.AddressEnabled(this.checked);"
			)
		);
		?>
		<p/>
		<?php
		echo Form::makeInput(
			array(
				"name"=>"streetAddress",
				"placeholder"=>"Street Address",
				"disabled"=>$_COOKIE['seattle911-address-enabled'] == "false",
				"class"=>"no-margin",
				"value"=>$_COOKIE['seattle911-address-street'],
				"onblur"=>"Seattle911.UI.Settings.AddressStreet(this.value);",
			)
		);
		?>
		<p/>
		<?php
		echo Form::makeInput(
			array(
				"name"=>"addressCity",
				"placeholder"=>"City",
				"disabled"=>$_COOKIE['seattle911-address-enabled'] == "false",
				"value"=>$_COOKIE['seattle911-address-city'],
				"onblur"=>"Seattle911.UI.Settings.AddressCity(this.value);"

			)
		);
		echo Form::makeInput(
			array(
				"name"=>"addressState",
				"placeholder"=>"State",
				"size"=>2,
				"maxlength"=>2,
				"disabled"=>$_COOKIE['seattle911-address-enabled'] == "false",
				"value"=>$_COOKIE['seattle911-address-state'],
				"onblur"=>"Seattle911.UI.Settings.AddressState(this.value);"

			)
		);
		echo Form::makeInput(
			array(
				"name"=>"addressZIP",
				"placeholder"=>"ZIP Code",
				"class"=>"no-margin",
				"size"=>5,
				"maxlength"=>5,
				"disabled"=>$_COOKIE['seattle911-address-enabled'] == "false",
				"value"=>$_COOKIE['seattle911-address-zip'],
				"onblur"=>"Seattle911.UI.Settings.AddressZIP(this.value);"

			)
		);
		?>
		</p>
		<input type="button" class="rounded-10 click no-border cancel left full-width" value="Close" onclick='jQuery(document).trigger("close.facebox");' />
	</form>
</div>
<?php
}

function Station($id) {

	global $url;

	$data = file_get_contents(sprintf($url . "/get-data?entity=station/details&id=%s", $id));
	$data = json_decode($data);

	ob_start();
?>
<div id="station-<?php echo $id;?>" class="modal centered">
	<div class="left">
		<h1 id="station-name" data-stationID="<?php echo $id;?>"><?php echo $data->Name;?></h1>
		<span id="station-address" class="address" data-latitude="<?php echo $data->Address->Location->Latitude;?>" data-longitude="<?php echo $data->Address->Location->Longitude;?>" data-heading="<?php echo $data->POV->Heading;?>" data-pitch="<?php echo $data->POV->Pitch;?>" data-zoom="<?php echo $data->POV->Zoom;?>"><?php echo $data->Address->FormattedAddress;?></span>
		<ul id="units" class="units">
<?php
	foreach ($data->Units as $unit) {
?>			<li><a href="#!/unit/<?php echo $unit->ID;?>" id="unit-<?php echo $unit->ID;?>" class="unit link" data-unitID="<?php echo $unit->ID;?>"><?php echo $unit->ID;?> - <?php echo $unit->Name;?></a></li>
<?php
	} 
?>		</ul>
		<p />
		<p><a href="#!/map/incidents/station/<?php echo $id;?>" class="link" id="showIncidents">Show incidents that units from <?php echo $data->Name;?> responded too</a></p>
	</div>
	<div class="right">
		<img id="building_map" src="http://maps.googleapis.com/maps/api/staticmap?size=250x250&center=<?php echo $data->Latitude;?>,<?php echo $data->Longitude;?>&markers=color:red|<?php echo $data->Address->Location->Latitude;?>,<?php echo $data->Address->Location->Longitude;?>&scale=2&sensor=false" />
		<img id="building_streetview" src="http://maps.googleapis.com/maps/api/streetview?size=250x250&location=<?php echo $data->Address->Location->Latitude;?>,<?php echo $data->Address->Location->Longitude;?>&heading=<?php echo $data->POV->Heading;?>&pitch=<?php echo $data->POV->Pitch;?>&fov=<?php echo $data->POV->Zoom;?>&sensor=false" />
	</div>	
</div>
<?php
	$html = ob_get_contents();
	ob_end_clean();

	return $html;	
}
?>
