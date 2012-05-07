<?php

foreach ($_REQUEST['data'] as $d) 
	$data[$d['name']] = $d['value'];

print_r($data);

$hndl = fopen("./city-requests.csv", "a");
fwrite($hndl, sprintf("%s,%s,%s\n", time(), $data['ip'], $data['city-name']));
	
?>
