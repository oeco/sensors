
var 
	config = require('./config'),
	_ = require('underscore'),
	async = require('async'),
	sensors = config.sensors;

/*
 * Initialize map
 */

var map = L.map('map').setView([-14.82,-49.09515], 4);
var xively_endpoint = "https://api.xively.com/v2/feeds/";
var sensors_geojson;

L.tileLayer('http://{s}.tiles.mapbox.com/v3/infoamazonia.h17kafbd/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
 * Add sensors to map
 */


_.each(sensors, function(sensor){
	// var marker = L.marker(sensor.latlon).addTo(map);
	var marker = L.marker(sensor.latlon);

	var popupContent = 
				"<p> "+sensor.options.name+" <p>";

	marker.bindPopup(popupContent);

	marker.addTo(map);

})

/*
 * Get sensor data
 */

async.map(sensors, function(sensor, doneMap){
	console.log(sensors);
	updateSensor(sensor, doneMap);
}, function(err, transformed){
	sensors = transformed;
	console.log(sensors[0]);
})

function updateSensor(sensor, doneUpdateSensor){
	getXivelyData(sensor.feed_id, sensor.x_apikey, function(err, data){
		if (err) return doneUpdateSensor(err);
		sensor.data = data;
		doneUpdateSensor(null, sensor);
	})
}

function getXivelyData(feed_id, x_apikey, params, callback){

	// if no data is passed	
	if (!callback) {
		callback = params;
		params = {};
	}

	$.ajax({
		url: xively_endpoint+feed_id,
		type: 'GET',
		data: params,
		dataType: 'json',
		beforeSend: function(request) {
			request.setRequestHeader("X-ApiKey", x_apikey);
		},
		success: function(data) { 
			callback(null, data) 
		},
		error: function(err) { callback(err) }
	});
}

function calcSensorStats(sensor_data) {
	

	sensor_data.stats = {};

	_.each(sensor_data.datastreams, function(stream, index, streams){
		
		var datapoints = stream.datapoints;

		// only calculate if datapoints is defined
		if (datapoints) {

			// remove negatives and extremely high
			datapoints = _.filter(datapoints, function(point){
				value = parseFloat(point.value)
				return ( value >= 0 && value <= 1000);
			})

			// init statistics
			var stats = {
				count: 0,
				mean: 0,
				min: parseFloat(datapoints[0].value),
				max: parseFloat(datapoints[0].value)
			}

			// calculate statistics
			_.each(datapoints, function(point){
				value = parseFloat(point.value)
				stats.count += 1;
				stats.mean += value;
				stats.min = (value < stats.min) ? value : stats.min;
				stats.max = (value > stats.max) ? value : stats.max;
			});
			stats.mean = stats.mean / datapoints.length;

			// include statistics on sensor data
			sensor_data.stats[stream.id] = stats;
		}

	})

	return sensor_data;
}

function getDatastream(feed_id, x_apikey, start, duration, callback){

	var params = {
		start: start || '2014-05-05T',
		duration: duration || '6hours'
	}
	
	xivelyApiGet(feed_id, x_apikey, params, callback);

}


function parseSensorGeoJSON(geojson, doneParse){

	async.each(geojson.features, function(f, callback){
		console.log(f);
		getDatastream(f.properties['feed_id'], f.properties['X-ApiKey'], '2014-05-05T', '6hours', function(err, sensorData){
			if (err) return callback(err);
			else {
				f.properties.xively = calcSensorStats(sensorData);
				console.log(f.properties);
				callback()			
			}
		});
	}, doneParse);
}