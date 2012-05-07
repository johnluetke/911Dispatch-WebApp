<?php

function logf($message) {
//  $fd = fopen('proxy.log', "a");
//  fwrite($fd, $message . "\n");
//  fclose($fd);
}

$url = "http://seattle911.johnluetke.net/%s.%s";

$entity = isset($_REQUEST['entity']) ? $_REQUEST['entity'] : "__BOGUS__";
$id = isset($_REQUEST['id']) ? $_REQUEST['id'] : false;
$format = isset($_REQUEST['format']) ? $_REQUEST['format'] : "json";

$url = sprintf($url, !$id ? $entity : $entity . "/". $id, $format);

unset($_GET['entity']);
unset($_GET['__utma']);
unset($_GET['__utmz']);

$query = array();

foreach ($_GET as $k=>$v) {
	$query[] = sprintf("%s=%s", $k, urlencode($v));
}
 
$query = join("&", $query);
//$query = strlen($query) > 0 ? "&".$query : "";

$querystring = sprintf("%s%s", "?", htmlentities($query));
$url = $url.$querystring;
$url = str_replace("&amp;", "&", $url);

//die($url);

logf($url);

ob_start();

$curl_handle = curl_init($url);
curl_setopt($curl_handle, CURLOPT_HEADER, 0);
//curl_setopt($curl_handle, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl_handle, CURLOPT_USERAGENT, "Seattle911 AJAX Proxy");

$content = curl_exec($curl_handle);
$content_type = curl_getinfo($curl_handle, CURLINFO_CONTENT_TYPE);

curl_close($curl_handle);
header("Content-Type: $content_type");

echo $content;
ob_flush();

?>
