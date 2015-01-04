<?php
	require_once("../api.php");

	$json = file_get_contents($eliqURL."datanow?accesstoken=".$accesstoken);

	echo $json;
?>