google.load("visualization", "1", {packages:["corechart"]});


var currentUsageInterval = 15000, // 15s
	currentUsagePower = 0,
	currentUsageTime,
	currentUsageTimeFormated;

var past24_GraphValues 	= [],
	past24_GraphTime	= [],
	past24_GraphVal 	= [];


$(function(){

	setInterval(currentUsage, currentUsageInterval);
	currentUsage();

	pastDayUsage();

	setTimeout(function(){
		google.setOnLoadCallback(drawPast24_Graph);
		drawPast24_Graph();
	}, 1000);

});

$(window).resize(function(){
  drawPast24_Graph();
});

// ###########################################
//		CURRENT USAGE (W)
// 
function currentUsage(){
	var dataPath = "ajax/dataCurrent.php";

	$.getJSON(dataPath, function(data) {
		
		currentUsagePower 			= data.power;
		currentUsageTime 			= data.createddate;
		currentUsageTimeFormated 	= formatDate(data.createddate);

		showCurrentUsage();
	});

}

function showCurrentUsage(){
	var el_val = $(".current-usage-value"),
		el_time = $(".current-usage-time");

	el_val.text(currentUsagePower + " W");
	el_time.text(currentUsageTimeFormated);
}

// ###########################################
//		USAGE PAST 24 HOURS (W)
// 
function pastDayUsage(){
	var dataPath = "ajax/dataLast24.php";

	past24_GraphVal.push(["Time", "Watt"]);

	$.getJSON(dataPath, function(data) {
		$.each(data.data, function(i, item){
			var power = item.avgpower,
				start = formatDate(item.time_start),
				end = formatDate(item.time_end);

			past24_GraphValues.push(power);
			past24_GraphTime.push(start);

			var startTime = formatDate(item.time_start, "time");

			past24_GraphVal.push([startTime, power]);

		});

		var getAvg = calculateAverage(past24_GraphValues);
		var getHighest = getHighestValue(past24_GraphValues);
		var getLowest = getLowestValue(past24_GraphValues);
		$(".last-24-avg span").text(Math.floor(getAvg) + " W");
		$(".last-24-high span").text(Math.floor(getHighest) + " W");
		$(".last-24-low span").text(Math.floor(getLowest) + " W");

	});
}

function pastDayGraph(){
	// Get context with jQuery - using jQuery's .get() method.
	var can = $("#last24"),
		ctx = can.get(0).getContext("2d");

	// This will get the first returned node in the jQuery collection.
	var myLineChart = new Chart(ctx).Line(past24_Graph, {
		scaleLabel: "<%=value%> W",
		pointHitDetectionRadius : 0,
		pointDot : false,
		scaleFontSize: 10,
		showXLabels: 20
	});


}

function formatDate(t, type) {

	var time = new Date(t),
		hour = ("0" + time.getUTCHours()).slice(-2),
		minute = ("0" + time.getUTCMinutes()).slice(-2)
		date = time.getDate(),
		monthNames = ["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
		month = monthNames[time.getMonth()],
		formatedTime = date + "-" + month + " " + hour + ":" + minute;
	if(type == "time") {
		return hour + ":" + minute;
	} else {
		return formatedTime;
	}
	
}


function drawPast24_Graph(){
	var wrap = $(".last-24-graph");

	var data = google.visualization.arrayToDataTable(past24_GraphVal);

	var options = {
		areaOpacity : 0.1,
		chartArea : {width: "90%", backgroundColor : "none"},
		backgroundColor : "none",
		colors : ["#F4B303"],
		hAxis: {slantedTextAngle : 90, showTextEvery : 30, textStyle : {color: "#EAEAF4"}},
		vAxis: {minValue: 0, format : "#####", gridlines : {color : '#3D3E43'}, baselineColor : "#F4B303",  textStyle : {color: "#EAEAF4"}},
		legend: "none",
		fontSize: 10
	};

	var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}

function calculateAverage(arr) {
	var sum = 0;

	for (var i = 0; i < arr.length; i++) {
		sum += parseInt(arr[i], 10);
	}

	var avg = sum/arr.length;

	return avg;
}

function getHighestValue(arr) {
	return Math.max.apply( Math, arr );
}

function getLowestValue(arr) {
	return Math.min.apply( Math, arr );
}