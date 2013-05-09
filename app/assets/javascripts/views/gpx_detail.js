CA.Views.GpxGraph = Backbone.View.extend({
	tagName: "div",
	className: "gpx-graph",
	
	attributes: {
	},
	
	events: {
	},
	
	initialize: function(){
		var that = this;
		this.r = 10;
		this.WIDTH = 1200;
		this.HEIGHT = 200,
		this.MARGINS = {top: 20, right: 20, bottom: 20, left: 30};
		this.vis = d3.select('.outside-svg') .attr("viewBox", "0 0 1200 200");
		
		$panoBtn = $('#pano-modal-btn');
		
		CA.Store.Marker.on('click', function(){
			var datum = CA.Store.CurrentDatum;
			var pos = new google.maps.LatLng( datum.get('lat'), datum.get('lon') );
			
			that.sv.getPanoramaByLocation( pos, 50, function(data, status){ CA.Store.Panorama.setPano(data.location.pano);});

			$panoBtn.click();
		
		});

		this.sv = new google.maps.StreetViewService();
		
		if (navigator.userAgent.match(/iPad|iPhone|iPad/i) != null){
			this.vis.on('touchmove', function(evt) {
										$('body').on('touchmove', that.preventDefault);
										var datum = that.setInfo(d3.mouse(this));
										that.displayInfo(datum); 
										CA.Store.CurrentDatum = datum;
									})
				.on('touchend', function(){
					$('body').off('touchmove', that.preventDefault);
				});
		} else {
			this.vis.on('mousemove', function(d) { 
										var datum = that.setInfo(d3.mouse(this));
										that.displayInfo(datum); 
										CA.Store.CurrentDatum = datum;
									});			
		}
		

	},
	
	preventDefault: function (evt){
		evt.preventDefault();
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
		
		if (that.model.get('image') == null){
			
			window.setTimeout(function(){
				that.captureMap();
					
			}, 500);	
		}

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
		var that = this;
		html2canvas(document.getElementById('map'), {
			useCORS: true,
			logging: true,
			profile: false,
			timeout: 1000,
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
			var re = /^.*\((-?[0-9]+)px, (-?[0-9]+)px, 0\);/;
			var pane = $('.leaflet-map-pane');
			var trans_coord = pane.attr('style');
			var m = trans_coord.match(re);

			var svg = serializer.serializeToString(s);
			ctx.drawSvg(svg,parseInt(m[1]),parseInt(m[2]));
			
			$canvas = $(canvas);
			var thumb_width = 500;
			var thumb_height = 300
			var center = [ parseFloat($canvas.attr('width'))/2, parseFloat($canvas.attr('height'))/2 ];
			var top_left_corner = [ center[0] - thumb_width/2, center[1] - thumb_height/2 ]
			
			var crop_data = ctx.getImageData(top_left_corner[0], top_left_corner[1],
											  thumb_width, thumb_height);
			$canvas.attr({ height: thumb_height, width: thumb_width });
			ctx.putImageData(crop_data, 0, 0)
			
			that.model.save({'image': $('#mini-map')[0].toDataURL()}, {patch: true});

		  }
		});
		
		return true;
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
		
		var maxSpeed = 0;

		_.each(data, function(node){
			that.latlngs.push(new L.LatLng(parseFloat(node.get('lat')), parseFloat(node.get('lon'))))				
		});
		
		return true;
	},
	
	setMap: function(){
		var that = this;
		var data = that.model.get('trk').get('trkseg').get('trkpts').models[0];
		
		var latLng =  that.calcCenter();

		CA.Store.Map.setView( latLng, 11);
		L.tileLayer('http://spaceclaw.stamen.com/toner/{z}/{x}/{y}.png', {
		    maxZoom: 14,
			minZoom: 11
		}).addTo(CA.Store.Map);
		
		if (CA.Store.Polyline !== undefined){
			CA.Store.Map.removeLayer(CA.Store.Polyline);			
		}

		CA.Store.Polyline = L.polyline(that.latlngs, {color: 'red'});
		CA.Store.Polyline.addTo(CA.Store.Map);
		CA.Store.Marker.setLatLng( latLng );
		CA.Store.Marker.update();
		CA.Store.Marker.bindPopup("StartScrubbing").openPopup();	

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
					.domain(that.model.get('DistBounds'));
		
		that.yRange = d3.scale.linear()
					.range ([that.HEIGHT - that.MARGINS.bottom, that.MARGINS.bottom])
					.domain(that.model.get('EleBounds'));
				
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
		$('.elevation').html( d.get('ele').toFixed(1) + " FT");
		$('.dist').html( d.get('dist').toFixed(1) + " MILES");
		var latLng =  new L.LatLng(d.get('lat'), d.get('lon'));
		CA.Store.Map.panTo( latLng );
		CA.Store.Marker.setLatLng( latLng );
		CA.Store.Marker.update();
		CA.Store.Marker.unbindPopup()
						.bindPopup("<div><strong>Speed: </strong>" + d.get('speed').toFixed(1) + " MPH</div>"+
									"<div><strong>Elevation: </strong>" + d.get('ele').toFixed(1) + " FT</div>"+
									"<div><strong>Distance: </strong>" + d.get('dist').toFixed(1) + " MILES</div>"
								).openPopup();
		
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