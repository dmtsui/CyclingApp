CA.Views.GeoLocationView = Backbone.View.extend({
	tagName: 'div',
	
	attributes:{
		"class": "geo-position container"
	},
	
	events: {
		'click .geo-start': "getGeoData"
	},
	
	initialize: function(){
		var that = this;
		
		that.trk = new CA.Models.Trk()
		that.trkseg = new CA.Models.Trkseg();
		that.trkpts = new CA.Collections.Trkpts();
		
		that.trkseg.set('trkpts', that.trkpts);
		that.trkseg.set('trkseg', that.trkseg);
		that.model.set('trk', that.trk);	
	},
	
	render: function(){
	    var that = this;
	    var renderedContent = JST["gpx/geo_location"]();
	    that.$el.html(renderedContent);
		that.$lat = $('.lat');
		that.$lon = $('.lon');
		that.$ele = $('.ele');
		that.$time = $('time');
		that.$speed = $('.speed');
		that.$heading = $('heading');
	    return that;
	},
	
	startRecord: function(){
		var that = this;
		window.setInterval(that.getGeoData, 3000, that);
	},
	
	getGeoData: function(){
		var that = this;
		navigator.geolocation.watchPosition(that.parseGeoData, that.geoError, {enableHighAccuracy: true});
	},
	
	parseGeoData: function(position){
		var that = this;
		var trkpt = new CA.Models.Trkpt();
		trkpt.set({
				'lat': position.coords.latitude,
				'lon': position.coords.longitude,
				'ele': position.coords.altitude,
		  'timestamp': new Date( position.timestamp ),
			  'speed': position.coords.speed,
			'heading': position.coords.heading
		});
		
		$('.lat').html(trkpt.get('lat'));
		$('.lon').html(trkpt.get('lon'));
		$('.ele').html(trkpt.get('ele'));
		$('.time').html(trkpt.get('timestamp'));
		$('.speed').html(trkpt.get('speed'));
		$('.heading').html(trkpt.get('heading'));
		
		that.model.get('trk').get('trkseg').get('trkpts').add(trkpt);
	},
	
	geoError: function(){
		console.log("error proccessing geoLocation");
	}
	
});