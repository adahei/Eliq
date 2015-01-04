<?php
	require_once("functions.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>El data</title>
	<link rel="stylesheet" href="css/styles.css">
</head>
<body>
	<section class="section section-current-usage">
		<h1>Nuvarande:</h1>
		<div class="box current-usage-wrap">
			<span class="current-usage-value big"></span>
			<span class="current-usage-time"></span>
		</div>
	</section>

	<section class="section section-last-24">
		<h1>Senaste dygnet:</h1>
		<div class="flexbox">
			<div class="flex-item box last-24-low">
				<h3>Lägst: </h3>
				<span class="big"></span>
			</div>
			<div class="flex-item box last-24-avg">
				<h3>Medel: </h3>
				<span class="big"></span>
			</div>
			<div class="flex-item box last-24-high">
				<h3>Högst: </h3>
				<span class="big"></span>
			</div>
		</div>
		<div class="box chart-container">
			<div id="chart_div" class="chart"></div>
			<!-- <canvas id="last24" width="1200" height="500"></canvas> -->
		</div>
	</section>

<script type="text/javascript">
  WebFontConfig = {
    google: { families: [ 'Lato:400,700:latin', 'Slabo+27px::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })(); </script>

	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script src="js/jq.js"></script>
	<script src="js/chart.js"></script>
	
	<script src="js/script.js"></script>
</body>
</html>