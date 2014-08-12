/**
* Expose config
*/


module.exports = {
	sensors: [{
		options: {
			name: 'DustDuinoBR1',
			feed_id: 337571715,
			APIEndpoint: 'https://api.xively.com/v2/feeds/337571715',
	        x_apikey: "yLqj9j87xW37ktl8p8D3W7Bjm2wNdFyiJp3mwq68TQubIqo7"			
		},
        latlon: [
			-23.589160275994917,
			-46.5985107421875
        ]
	},{
		options: {
			name: 'DustDuinoBR2',
			feed_id: 1070388971,
			APIEndpoint: 'https://api.xively.com/v2/feeds/1070388971',
	        x_apikey: "eHIZoVN3r4dk3m0nfcapZDgV1n2W72o7Q1yZcI2rJrpCZnMi",
	    },
        latlon: [
          	-23.547990823135276,
 			-46.66410148143768
		]
	},{
		options: {
			name: 'DustDuinoBR3',
			feed_id: 2001586077,
			APIEndpoint: 'https://api.xively.com/v2/feeds/2001586077',
	        x_apikey: "h21DurKJ4UwlM7fTB7BHP5APwxtUK69ALi2sjfDtgtfUnUwD",
	    },
        latlon: [
			-12.979133130990242,
			-38.49884033203125
        ]
	}]
}