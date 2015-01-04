<?php
	require_once("../api.php");

	$startDate = date("Y-m-d\TH:i:s", strtotime("-24 hours"));
	$endDate = date("Y-m-d\TH:i:s");

	$json = file_get_contents($eliqURL."data?accesstoken=".$accesstoken."&startdate=".$startDate."&enddate=".$endDate."&intervaltype=6min");

	echo $json;
?>