

function xivelyApiGet(feed_id, x_apikey, data, callback){

	// if no data is passed	
	if (!callback) {
		callback = data;
		data = {};
	}

	$.ajax({
		url: xively_endpoint+feed_id,
		type: 'GET',
		data: data,
		dataType: 'json',
		beforeSend: function(request) {
			request.setRequestHeader("X-ApiKey", x_apikey);
		},
		success: function(data) { 
			callback(null, data.datastream) 
		},
		error: function(err) { callback(err) }
	});
}

function getDatastream(feed_id, x_apikey, start, duration, callback){
	// https://api.xively.com/v2/feeds/2001586077.json?start=2014-05-05T&duration=6hours

	var data = {
		start: start || '2014-05-05T',
		duration: duration || '6hours'
	}
	
	xivelyApiGet(feed_id, x_apikey, data, callback);

}

function calcStreamStats(stream, callback) {
	
	// remove negatives and extremely high
	datapoints = _.filter(datapoints, function(point){
		value = parseFloat(point.value)
		return ( value >= 0 && value <= 1000);
	})

	var stats = {
		mean: 0,
		min: datapoints[0].value,
		max: datapoints[0].value
	}

	// calculate statistics
	_.each(datapoints, function(point){
		value = parseFloat(point.value)
		stats.mean += value;
		stats.min = (value < stats.min) ? value : stats.min;
		stats.max = (value > stats.max) ? value : stats.max;
	});

	stats.mean = stats.mean / datapoints.length;

	stream.stats = stats;

	return stream;
}

function fetchSensorData(feed_id, x_apikey, callback){
	getDatastream(feed_id, x_apikey, '2014-05-05T', '6hours', callback);
}

function parserSensorGeoJSON(geojson, callback){

	async.each(geojson.features, function(f, callback){
		fetchSensorData(f.properties['feed_id'], f.properties['X-ApiKey'], function(err,data){
			f.properties = _.extend(f.properties, data);
			features.push(f);
			callback();
		});
	});
}