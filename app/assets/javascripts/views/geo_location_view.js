CA.Views.GeoLocationView = Backbone.View.extend({
	tagName: 'div',
	
	attributes:{
		"class": "geo-position container"
	},
	
	events: {
		'click .geo-start': "getGeoData",
		'click .geo-stop': "saveGeoData"
	},
	
	initialize: function(){
		var that = this;
		
		that.trk = new CA.Models.Trk()
		that.trkseg = new CA.Models.Trkseg();
		that.trkpts = new CA.Collections.Trkpts();
		
		that.trkseg.set('trkpts', that.trkpts);
		that.trk.set('trkseg', that.trkseg);
		that.model.set('trk', that.trk);	
	},
	
	render: function(){
	    var that = this;
	    var renderedContent = JST["gpx/geo_location"]();
	    that.$el.html(renderedContent);
	    return that;
	},
	
	saveGeoData: function(){
		var that = this;
		navigator.geolocation.clearWatch( that.watchId );
		console.log('savingGeoData');
		that.model.calcBounds();	
		that.model.save({}, {
			success: function (gpx){
				console.log("success hit");
				CA.Store.Gpxes.add(gpx);
				$('#file').text("New Ride!");
				CA.Store.Router.navigate("#/gpxes/"+gpx.get('id'));
			}
		});
	},
	
	getGeoData: function(){
		var that = this;
		that.watchId = navigator.geolocation.watchPosition(that.parseGeoData.bind(that), that.geoError, {enableHighAccuracy: true});
	},
	
	parseGeoData: function(position){
		var that = this;
		var trkpt = new CA.Models.Trkpt();
		trkpt.set({
				'lat': position.coords.latitude,
				'lon': position.coords.longitude,
				'ele': position.coords.altitude,
		  	   'time': new Date( position.timestamp ),
			//   'speed': position.coords.speed,
			// 'heading': position.coords.heading
		});
		
		$('.lat').html(trkpt.get('lat'));
		$('.lon').html(trkpt.get('lon'));
		$('.ele').html(trkpt.get('ele'));
		$('.time').html(trkpt.get('time'));
		//$('.speed').html( position.coords.speed );
		//$('.heading').html( position.coords.heading );
		
		that.model.get('trk').get('trkseg').get('trkpts').add(trkpt);
	},
	
	geoError: function(){
		console.log("error proccessing geoLocation");
	}
	
});