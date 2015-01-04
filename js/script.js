var color_background		= "#26272C",
	color_primary			= "#F4B303",
	color_primary_medium	= "#E58A00",
	color_primary_dark		= "#E5360B",
	color_text				= "#EAEAF4",
	color_gray_light		= "#B2B2B2",
	color_gray				= "#3D3E43",
	color_positive			= "#55BF3B";

var setRandomValues			= false,
	showDebugData			= false,
	updateInterval			= 5000;

var current_power			= 0,
	current_createddate,
	current_array			= [],
	current_data_loaded		= false,
	current_power_updated	= true;

var past_time				= [],
	past_power				= [],
	past_data_loaded		= false;

var watt_high				= 0,
	watt_low				= 0,
	watt_avg				= 0;

var chart_gauge_loaded		= false,
	chart_current_loaded	= false,
	chart_past_loaded		= false;

/* 
	## Data needed for graphs:
	----------------------------------
	# GAUGE: 
		watt_low		: {number}
		watt_high		: {number}
		current_power 	: {number}

	# CURRENT USAGE GRAPH:
		current_power	: {number}
		current_array	: {array: ["time", power]}

	# PAST DAY GRAPH:
		past_time		: {array: ["time"]}
		past_power		: {array: [power]}

*/


$(function(){

	setInterval(getData, updateInterval);
	getData();

});


/**
 * GET DATA FROM API
 *************************** */
function getData() {
	var dataPastDay = "ajax/dataLast24.php";

	$.getJSON(dataPastDay)
	.done(function(data){

		$.each(data.data, function(i, item){
			var power 		= item.avgpower,
				time		= item.time_start;

			past_power.push(power);
			past_time.push(formateDate(time, "time"));

		});

		// Get specific data from the array
		watt_high	= getHighVal(past_power);
		watt_low	= getLowVal(past_power);
		watt_avg	= calcAvg(past_power);

		past_data_loaded = true;
		
		if(showDebugData) {
			console.log("dataPastDay - Done!");
			console.log(data);
		};

		// Fetch current usage data
		getDataCurrent();
	})
	.fail(function(jqxhr, textStatus, error){
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

/**
 * GET DATA FROM API
 * Only fetch current usage data
 *************************** */
function getDataCurrent(){
	var dataCurrent = "ajax/dataCurrent.php";

	$.getJSON(dataCurrent)
	.done(function(data){
		var power 			= data.power,
			createddate 	= data.createddate,
			new_current_pwr;

		// Set random value if variable "setRandomValues" is true
		if(setRandomValues) {
			var high_val = watt_high,
				low_val = watt_low;

			if(high_val === 0) {
				high_val = 15000;
				low_val = 50;
			}

			var randomValue = randomNumbers(low_val, high_val);
			new_current_pwr = randomValue;

		} else {

			// If current usage is higher than earlier measurements, then make this the highest one.
			if(current_power > watt_high) watt_high = current_power;

			new_current_pwr = power;
		}

		// Check if power has been updated
		if(createddate !== current_createddate && current_createddate !== "undefined") {
			current_power_updated = true;
			current_power 		= new_current_pwr;
			current_createddate = createddate;
			current_array		= [formateDate(current_createddate, "time"), current_power];

		} else {
			current_power_updated = false;
		}

		if(showDebugData) {
			console.log("dataCurrent - Done!");
			console.log(data);
			debugData();
		}

		current_data_loaded = true;
		showData();
	})
	.fail(function(jqxhr, textStatus, error){
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

/**
 * DRAW CHARTS
 *************************** */
function showData() {
	if(showDebugData) console.log("showData - Done!");

	/* 
		GAUGE CHART FOR CURRENT USAGE
	*/
	if(chart_gauge_loaded) {
		var gauge_chart = $("#chart_current_gauge").highcharts();

		gauge_chart.series[0].points[0].update(current_power);

		if(current_power > watt_high) {
			gauge_chart.yAxis[0].update({max: current_power});
		}
	} else {
		currentGaugeChart();
		if(current_power > watt_high) {
			gauge_chart.yAxis[0].update({max: current_power});
		}
	}

	/* 
		LINE CHART FOR CURRENT USAGE
	*/
	if(chart_current_loaded) {
		if(current_power_updated) {
			var current_chart = $("#chart_current").highcharts();
			current_chart.series[0].addPoint(current_array);
		}
	} else {
		currentUsageChart();
	}

	/* 
		LINE CHART FOR PAST 24 HOURS
	*/
	if(!chart_past_loaded) {
		lastDayUsageChart();
	}

	lastDayUsageStats();
	
}

/**
 * GAUGE CHART FOR CURRENT USAGE
 *************************** */
function currentGaugeChart(){

	chart_gauge_loaded = true;

	$("#chart_current_gauge").highcharts({
		chart: {
			type: "solidgauge",
			backgroundColor: null
		},
		title: null,
		pane: {
			center: ['50%', '85%'],
			size: '140%',
			startAngle: -90,
			endAngle: 90,
			background: {
				backgroundColor: color_gray,
				innerRadius: '60%',
				outerRadius: '100%',
				shape: 'arc',
				borderColor: null
			}
		},
		tooltip: {
			enabled: false
		},
		yAxis: {
			min: watt_low,
			max: watt_high,
			stops: [
				[0.1, color_positive],
				[0.5, color_primary_medium],
				[0.9, color_primary_dark]
			],
			lineWidth: 0,
			minorTickInterval: null,
			tickWidth: 0,
			title: null,
			labels: {
				enabled: false
			}
		},
		credits: {
			enabled: false
		},
		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		},
		series: [{
			name: 'Watt',
			data: [current_power],
			dataLabels: {
				format: '<span class="gauge-chart-label">{y} W</span>'
			},
			tooltip: {
				valueSuffix: 'W'
			}
		}]
	});
}

/**
 * CHART FOR CURRENT USAGE
 *************************** */
function currentUsageChart(){
	chart_current_loaded = true;

	$("#chart_current").highcharts({
		chart: {
			type: "area",
			backgroundColor: null
		},
		title: null,
		colors: [color_primary_medium],
		xAxis: {
			type: "category",
			tickInterval: 5
		},
		yAxis: {
			gridLineColor: color_gray,
			title: null,
			labels: {
				format: "{value} W"
			}
		},
		plotOptions: {
			spline: {
				lineWidth: 4
			}
		},
		series: [{
			name: "Watt",
			data: [current_array],
			showInLegend: false
		}],
		credits: {
			enabled: false
		}
	});
}

/**
 * CHART FOR LAST 24 HOUR USAGE
 *************************** */
function lastDayUsageChart(){
	chart_past_loaded = true;

	$("#chart_pastDay").highcharts({
		chart: {
			backgroundColor: null
		},
		title: null,
		colors: [color_primary_medium],
		xAxis: {
			categories: past_time,
			tickInterval: 20
		},
		yAxis: {
			gridLineColor: color_gray,
			title: null,
			labels: {
				format: "{value} W"
			}
		},
		series: [{
			name: "Watt",
			data: past_power,
			showInLegend: false,
			marker: {
				enabled: false
			}
		}]
	});
}

function lastDayUsageStats(){
	var high 	= watt_high,
		low 	= watt_low,
		avg 	= watt_avg;

	$(".last-24-avg span").text(Math.floor(avg) + " W");
	$(".last-24-high span").text(Math.floor(high) + " W");
	$(".last-24-low span").text(Math.floor(low) + " W");
}

/**
 * DEBUGGING DATA
 *************************** */
function debugData(){

	var date = new Date(),
		timeStamp = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);

	console.log("------- DEBUG - " + timeStamp + " --------------------------" + "\n" +
				" Random values           : " + setRandomValues + "\n" +
				" Current power           : " + current_power + "\n" +
				" Current createddate     : " + current_createddate + "\n" +
				" ---------------------------------------------------" + "\n" +
				" Past time (arr length)  : " + past_time.length + "\n" +
				" Past time format        : " + past_time[0] + "\n" +
				" Past power (arr length) : " + past_power.length + "\n" +
				" ---------------------------------------------------" + "\n" +
				" Highest Watt            : " + watt_high + "\n" +
				" Lowest  Watt            : " + watt_low + "\n" +
				" Average Watt            : " + watt_avg + "\n" +
				" ---------------------------------------------------");
}

/**
 * HELPING CLASSES
 *************************** */
function formateDate(d, type) {
	var date 	= new Date(d),
		hour 	= ("0" + date.getUTCHours()).slice(-2),
		minute 	= ("0" + date.getUTCMinutes()).slice(-2),
		year 	= date.getFullYear(),
		month 	= ("0" + (date.getMonth() + 1)).slice(-2),
		date 	= ("0" + date.getDate()).slice(-2);

	if(type == "time") {
		return hour + ":" + minute;
	} else {
		return date + "-" + month + "-" + year + " " + hour + ":" + minute; 
	}
}

function calcAvg(arr) {
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		sum += parseInt(arr[i], 10);
	}
	var avg = sum/arr.length;
	return avg;
}

/*
 *	Return sum of array
 */
function calcSum(arr) {
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		sum += parseInt(arr[i], 10);
	}
	return sum;
}

/*
 *	Return highest value in array
 */
function getHighVal(arr) {
	return Math.max.apply( Math, arr );
}

/*
 *	Return lowest value in array
 */
function getLowVal(arr) {
	return Math.min.apply( Math, arr );
}

/*
 *	Return random value between @min and @max
 */
function randomNumbers(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
