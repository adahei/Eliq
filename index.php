<?php
	require_once("functions.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta charset="UTF-8">
	<title>El data</title>
	<link rel="stylesheet" href="css/styles.css">
</head>
<body>
	<section class="section section-current-usage">
		<h1>Nuvarande:</h1>
		<div class="flexbox chart-container">
			<div id="chart_current_gauge"></div>
			<div id="chart_current" class="flex-item chart"></div>
		</div>		
	</section>

	<section class="section section-last-24">
		<h1>Senaste 24h:</h1>
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
			<div id="chart_pastDay" class="chart"></div>
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

	<script src="js/jq.js"></script>
	<script src="js/highcharts.js"></script>
	<script src="js/highcharts-more.js"></script>
	<script src="js/modules/solid-gauge.src.js"></script>
	<script src="js/script.js"></script>
</body>
</html>