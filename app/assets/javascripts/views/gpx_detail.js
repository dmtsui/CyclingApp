CA.Views.GpxGraph = Backbone.View.extend({
	tagName: "div",
	className: "gpx-graph",
	
	attributes: {
	},
	
	events: {
		"click button.drawElev": "drawElev"
	},
	
	initialize: function(){
		var that = this;
		this.r = 10;
		this.WIDTH = 1200;
		this.HEIGHT = 200,
		this.MARGINS = {top: 20, right: 20, bottom: 20, left: 30};
		this.vis = d3.select('.outside-svg');
		
		this.sv = new google.maps.StreetViewService();
		
		this.vis.on('mousemove', function(d) { 
									var datum = that.setInfo(d3.mouse(this));
									that.displayInfo(datum); 
								})
				.on('click', function(d){
					var datum = that.setInfo(d3.mouse(this));
					var pos = new google.maps.LatLng( parseFloat(datum.get('lat')), parseFloat(datum.get('lon')) );
					
					that.sv.getPanoramaByLocation( pos, 50, function(data, status){ CA.Store.Panorama.setPano(data.location.pano);});
					
					// var $tileContainer = $('div.leaflet-tile-pane');
					// var tiles = $('img.leaflet-tile')
					// var new_tiles = []
					// _.each(tiles, function(tile){
					// 	var $tile = $(tile);
					// 	var style = $tile.attr('style');
					// 	var klass = $tile.attr('klass');
					// 	var src = $tile.attr('src');
					// 	
					// 	var img = new Image();
					// 	$img = $(img);
					// 	$img.attr('style', style);
					// 	$img.attr('class', klass);
					// 	console.log(img);
					// 	img.onload = function(){
					// 		new_tiles.push(img);
					// 		tile.src = img.to
					// 	}
					// 	//tile.crossOrigin = "anonymous";
					// 	img.src = src;
					// });
					// 
					
					
					// html2canvas(document.getElementById('map'), {
					// 	useCORS: true,
					// 	logging: false,
					// 	profile: false,
					//   onrendered: function(canvas) {
					//     document.getElementById('canvas-div').appendChild(canvas);
					//   }
					// });
					// 				
					
					// var ctx = canvas.getContext("2d");
					// 
					// var data = "data:image/svg+xml;base64;" + svg;
					// 
					// var img = new Image();
					// 
					// 
					// 
					// img.onload = function() { ctx.drawImage(img, 0, 0); }
					// 
					// img.src = data;
						
				// 	html2canvas(document.getElementById('map'), {
				// 		useCORS: true,
				// 		logging: false,
				// 		profile: false,
				// 	  onrendered: function(canvas) {
				// 	    document.getElementById('canvas-div').appendChild(canvas);
				// 		canvas.setAttribute('id', 'mini-map')
				// 		var serializer = new XMLSerializer();
				// 		var ctx = canvas.getContext('2d');
				// 		var s = $('svg.leaflet-zoom-animated')[0];
				// 		if (s.getAttribute('style') !== null){
				// 			s.removeAttribute('style');
				// 			s.removeAttribute('viewBox');
				// 		}
				// 		re = /^.*\((-?[0-9]+)px, (-?[0-9]+)px, 0\);/;
				// 		pane = $('.leaflet-map-pane');
				// 		trans_coord = pane.attr('style');
				// 		m = trans_coord.match(re);
				// 			
				// 		var svg = serializer.serializeToString(s);
				// 		ctx.drawSvg(svg,parseInt(m[1]),parseInt(m[2]));
				// 	  }
				// 	});
				that.captureMap();
				});	




	},
	
	render: function(xfunc, yfunc){
		var that = this;
		that.vis.selectAll('circle').remove();
		that.vis.selectAll('g').remove();
		that.circle = this.vis.append('circle').attr('r', 10);
		that.calcBounds();
		var data_set = CA.Helpers.Cluster.cluster(that.setTrkpts(),1)
		that.setMap();
		

	


		that.setBounds().setAxis().drawAxis();		
		that.plotData(data_set, xfunc, yfunc);
		
		var pos = new google.maps.LatLng( parseFloat(this.data[0].get('lat')), parseFloat(this.data[0].get('lon')) );
		
		that.sv.getPanoramaByLocation( pos, 50, function(data, status){ CA.Store.Panorama.setPano(data.location.pano);});
		
		
		//window.setTimeout(that.captureMap, 2000);

		return that;
	},
	
	calcCenter: function(){
		var that = this;
		var length = that.data.length;
		var segment = Math.floor(length/4);
		var xs = 0;
		var ys = 0;
		for(var i = 0; i < 5; i++){
			var datum = that.data[i*segment];
			xs += parseFloat(datum.get('lat'));
			ys += parseFloat(datum.get('lon'));
		}
		
	
		
		var latLng =  new L.LatLng(xs/5, ys/5);
		
		return latLng;
		
	},
	
	captureMap: function(){
		html2canvas(document.getElementById('map'), {
			useCORS: true,
			logging: true,
			profile: false,
			timeout: 5000,
			proxy: "http://maps.stamen.com/",
		  onrendered: function(canvas) {
		   $('#canvas-div').html(canvas);
			canvas.setAttribute('id', 'mini-map')
			var serializer = new XMLSerializer();
			var ctx = canvas.getContext('2d');
			var s = $('svg.leaflet-zoom-animated')[0];
			if (s.getAttribute('style') !== null){
				s.removeAttribute('style');
				s.removeAttribute('viewBox');
			}
			re = /^.*\((-?[0-9]+)px, (-?[0-9]+)px, 0\);/;
			pane = $('.leaflet-map-pane');
			trans_coord = pane.attr('style');
			m = trans_coord.match(re);

			var svg = serializer.serializeToString(s);
			ctx.drawSvg(svg,parseInt(m[1]),parseInt(m[2]));

		  }
		});

		
	},
	
	drawElev: function (){
		console.log("button works")
	},
	
	setRte: function(){
		var that = this;
		that.data = that.model.get( 'rtes' ).first().get('rtepts').models;
		return that.data;
	},
	
	setWpts: function(){
		var that = this;
		that.data = that.model.get( 'wpts' ).models;
		return that.data;
	},
	setTrkpts: function(){
		var that = this;
		that.data = that.model.get( 'trk' ).get( 'trkseg' ).get( 'trkpts' ).models;
		return that.data;
	},
		
	calcBounds: function () {
		var that = this, lastDist = null;
		var data = that.model.get('trk').get('trkseg').get('trkpts').models;
		
		that.latlngs = [];

		var eleMax = parseFloat(data[0].get('ele'));
		var eleMin = eleMax;
		
		var totalDist = 0;
		
		var maxSpeed = 0;
		var allSpeeds = [];
		var lastTime;
		CA.Store.totalTime = 0;
			
		_.each(data, function(node){
			that.latlngs.push(new L.LatLng(parseFloat(node.get('lat')), parseFloat(node.get('lon'))))
			var currentEle = parseFloat(node.get('ele'));
			if (currentEle > eleMax){ eleMax = currentEle; }
			if (currentEle < eleMin){ eleMin = currentEle; }
			
			var currentDist = [parseFloat(node.get('lat')), parseFloat(node.get('lon'))];
			
			if (lastDist == null){
				node.set('dist', 0);
				allSpeeds.push(node.set('speed', 0));
				lastTime = new Date(node.get('time'));

			}else {
				var dist = Math.sqrt(Math.pow((currentDist[0]-lastDist[0]), 2) + Math.pow((currentDist[1]-lastDist[1]), 2));
				dist *= 62.1371;
				totalDist += dist;
				node.set('dist', totalDist);
				var currentTime = new Date(node.get('time'));
				var speed = that.calcSpeed(currentTime, lastTime, dist);
				if (speed > maxSpeed){ maxSpeed = speed; }
				node.set('speed', speed);
				allSpeeds.push(speed);
				lastTime = currentTime;
			}
			lastDist = currentDist;
			
			
		});
		allSpeeds.sort();
		
		console.log('calcbounds!');
		that.SpeedBounds = [0,maxSpeed];
		that.EleBounds = [eleMin, eleMax];
		that.DistBounds = [0, totalDist];
		console.log(that.DistBounds);
		
		return true;
	},
	
	setMap: function(){
		var that = this;
		var data = that.model.get('trk').get('trkseg').get('trkpts').models[0];
		
		//var point = [parseFloat(data.get('lat')), parseFloat(data.get('lon'))];
		var latLng =  that.calcCenter();
		//new L.LatLng(point[0], point[1]);
		//CA.Store.Map.panTo( latLng );
		CA.Store.Map.setView( latLng, 11);
		L.tileLayer('http://spaceclaw.stamen.com/toner/{z}/{x}/{y}.png', {
		    maxZoom: 18
		}).addTo(CA.Store.Map);
		that.polyline = L.polyline(that.latlngs, {color: 'red'}).addTo(CA.Store.Map);
		CA.Store.Marker.setLatLng( latLng );
		CA.Store.Marker.update();
		
			//that.captureMap();	

	},
	
	
	calcSpeed: function (currentTime, lastTime, dist) {
		var time = parseInt(currentTime - lastTime)/(3600000);
		CA.Store.totalTime += time;
		return ( dist/time );
	},	
	
	setXMap: function(){
		var that = this;
		return [that.model.get('bound').get('minlat'), that.model.get('bound').get('maxlat')];
	},
	
	setYMap: function(){
		var that = this;
		return [that.model.get('bound').get('minlon'), that.model.get('bound').get('maxlon')];
	},
	
	setBounds: function (xbound, ybound){		
		var that = this;
							
		that.xRange = d3.scale.linear()
					.range ([that.MARGINS.left, that.WIDTH - that.MARGINS.left])
					.domain(that.DistBounds);
		
		that.yRange = d3.scale.linear()
					.range ([that.HEIGHT - that.MARGINS.bottom, that.MARGINS.bottom])
					.domain(that.EleBounds);
				
		return that;	
	},
	
	setAxis: function(){
		var that = this;	
		that.xAxis = d3.svg.axis().scale(that.xRange).tickSize(1).tickSubdivide(5);
		that.yAxis = d3.svg.axis().scale(that.yRange).tickSize(1).orient("left").tickSubdivide(5);
		
		return that;
	},
	
	drawAxis: function (){
		var that = this;
		
		that.vis.append("svg:g").attr("class", "x-axis")
		that.vis.append("svg:g").attr("class", "y-axis")
		
		that.vis.select(".x-axis")
			.attr("transform", "translate(0,"+ (that.HEIGHT - that.MARGINS.bottom) +")").call(that.xAxis);
			
		that.vis.select(".y-axis")
			.attr("transform", "translate("+ (that.MARGINS.left) +", 0)").call(that.yAxis);
		return that;		
	},
	
	plotData: function (data, xfunc, yfunc){
		var that = this;
		
		// if(xbound != undefined && ybound != undefined){
		// 	that.setBounds(xbound, ybound).setAxis();
		// 	that.vis.select('.x-axis').call(that.xAxis);
		// 	that.vis.select('.y-axis').call(that.yAxis);
		// }
		
		that.vis.selectAll('path').remove();
		
		var line = d3.svg.line()
		.x(function(d){ return that.xRange ( xfunc(d) )  })
		.y(function(d){ return that.yRange ( yfunc(d) )  });
		
		that.vis.append("path").attr({
									   "d": line(data),
							'stroke-width': "2",
							      'stroke': "red",
								    'fill': "none"
								});

		that.setAxis();
	},
	
	setInfo: function (pos) {
		var that = this;
		var data_pos = Math.floor((pos[0]/ (that.WIDTH - 30)) * that.data.length );
		return that.data[data_pos];
		
	},
	
	displayInfo: function(d){
		var that = this;
		that.circle
			.attr("cx", that.xRange (d.get('dist') ) )
			.attr("cy", that.yRange ( d.get('ele')) );

		$('.speed').html( d.get('speed').toFixed(1) + " MPH");
		$('.elevation').html( parseFloat(d.get('ele')).toFixed(1) + " FT");
		$('.dist').html( d.get('dist').toFixed(1) + " MILES");
		var latLng =  new L.LatLng(parseFloat(d.get('lat')), parseFloat(d.get('lon')));
		CA.Store.Map.panTo( latLng );
		CA.Store.Marker.setLatLng( latLng );
		CA.Store.Marker.update();
	},
	
	
	setMapXRange: function(d){
		return parseFloat(d.get('lat'));
	},
	
	setMapYRange: function(d){
		return parseFloat(d.get('lon'));
	},
	
	setEle: function (d){
		return parseFloat(d.get('ele'));
	},
	
	setDist: function(d){
		return parseFloat(d.get('dist'));
	}
	
	
	
	
	
});