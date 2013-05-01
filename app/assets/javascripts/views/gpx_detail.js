CA.Views.GpxGraph = Backbone.View.extend({
	tagName: "div",
	className: "gpx-graph",
	
	attributes: {
	},
	
	events: {
		"click button.drawElev": "drawElev"
	},
	
	initialize: function(){
		
		this.r = 10;
		this.WIDTH = 1200;
		this.HEIGHT = 300,
		this.MARGINS = {top: 20, right: 20, bottom: 20, left: 30};
		this.vis = d3.select('.outside-svg');
		this.vis.append("svg:g").attr("class", "x-axis")
		this.vis.append("svg:g").attr("class", "y-axis")
		this.calcBounds();
		this.setMap();
		
	},
	
	render: function(data, xfunc, yfunc, xbound, ybound){
		var that = this;
		//that.addButtons();
		that.setBounds(xbound, ybound).setAxis().drawAxis();		
		that.plotData(data, xfunc, yfunc);
		
		return that;
	},
	
	addButtons: function (){
		var that = this;
		var elevation = $('<button>').attr('class', 'drawElev').html('elevation');
		that.$el.append(elevation);
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
		console.log(allSpeeds);
		console.log(maxSpeed);
		console.log(totalDist);
		console.log(CA.Store.totalTime);
		that.SpeedBounds = [0,maxSpeed];
		that.EleBounds = [eleMin, eleMax];
		that.DistBounds = [0, totalDist];
		
		return true;
	},
	
	setMap: function(){
		var that = this;
		var data = that.model.get('trk').get('trkseg').get('trkpts').models[0];
		
		var point = [parseFloat(data.get('lat')), parseFloat(data.get('lon'))];
		
		that.map = L.map('map').setView([ point[0], point[1]], 13);
		L.tileLayer('http://spaceclaw.stamen.com/toner/{z}/{x}/{y}.png', {
		    maxZoom: 18
		}).addTo(that.map);
		that.polyline = L.polyline(that.latlngs, {color: 'red'}).addTo(that.map);
		that.marker = L.marker([ point[0], point[1]]).addTo(that.map);

	},
	
	mapCenter: function(){
		
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
					.domain(xbound);
		
		that.yRange = d3.scale.linear()
					.range ([that.MARGINS.bottom, that.HEIGHT - that.MARGINS.bottom])
					.domain(ybound);
				
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
		
		that.vis.select(".x-axis")
			.attr("transform", "translate(0,"+ (that.HEIGHT - that.MARGINS.bottom) +")").call(that.xAxis);
			
		that.vis.select(".y-axis")
			.attr("transform", "translate("+ (that.MARGINS.left) +", 0)").call(that.yAxis);
		return that;		
	},
	
	calcPathPoint: function (command, datum, xfunc, yfunc) {
		var that = this;
		var pt = command + " " + that.xRange ( xfunc(datum) ) + " " + (that.HEIGHT - that.yRange ( yfunc(datum) )) + " ";
		return pt;
	},	
	
	plotData: function (data, xfunc, yfunc, xbound, ybound){
		var that = this;
		
		if(xbound != undefined && ybound != undefined){
			that.setBounds(xbound, ybound).setAxis();
			that.vis.select('.x-axis').call(that.xAxis);
			that.vis.select('.y-axis').call(that.yAxis);
		}
		
		
		var d = "M "+ that.MARGINS.left + " " + (that.HEIGHT - that.MARGINS.bottom) + " ";
		
		_.each(data, function(datum){
				d += that.calcPathPoint("L", datum, xfunc, yfunc);
		});
		d += "L "+ that.WIDTH + " " + (that.HEIGHT - that.MARGINS.bottom);
		
		that.vis.insert("svg:path").attr("d", d).attr('stroke-width', "2").attr("fill", d3.rgb(200,200,200));
		
		
		// that.vis.selectAll("circle").remove();
		// 
		// 
		// var circles = that.vis.selectAll("circle")
		// 			  .data(data);
		// 	circles.transition().duration(1000)
		// 		.attr("cx", function (d) { return that.xRange ( xfunc(d) ) })
		// 		.attr("cy", function (d) { return that.HEIGHT - that.yRange ( yfunc(d) ) })
		// 		.attr("r", function (d) { return 3 });
		// 	circles.enter()
		// 		.insert("svg:circle")
		// 		.attr("cy", that.HEIGHT - that.MARGINS.bottom)
		// 		.attr("r",0).on("mouseover", function(d){ 
		// 										that.displayInfo(d); 
		// 										d3.select(this).attr('r', 8).attr('fill', 'red');
		// 									}).on("mouseout", function(d) { d3.select(this).attr('r', 3).attr('fill', 'black')})
		// 		.transition().duration(1000)
		// 		.attr("cy", that.HEIGHT)
		// 		.attr("cx", function (d) { return that.xRange ( xfunc(d) ) })
		// 		.attr("cy", function (d) { return that.HEIGHT - that.yRange ( yfunc(d) ) })
		// 		.attr("r", function (d) { return 4 });
		// 	circles.exit()
		// 		.transition().duration(1000)
		// 		.attr("cy",  0)
		// 		.attr("r",0)
		// 		.remove();
		that.setAxis();
	},
	
	displayInfo: function(d){
		var that = this;
		$('.speed').html( d.get('speed').toFixed(1) + " MPH");
		$('.elevation').html( parseFloat(d.get('ele')).toFixed(1) + " FT");
		$('.dist').html( d.get('dist').toFixed(1) + " MILES");
		var latLng =  new L.LatLng(parseFloat(d.get('lat')), parseFloat(d.get('lon')));
		that.map.panTo( latLng );
		that.marker.setLatLng( latLng );
		that.marker.update();
		// that.map.setZoom(14).setCenter({ lat: parseFloat(d.get('lat')),
		// 	 						lon: parseFloat(d.get('lon')) });
		// 
	},
	
	
	setMapXRange: function(d){
		return parseFloat(d.get('lat'));
	},
	
	setMapYRange: function(d){
		return parseFloat(d.get('lon'));
	},
	
	setEle: function (d){
		//console.log(d.get('ele'));
		return parseFloat(d.get('ele'));
	},
	
	setDist: function(d){
		//console.log(d.get('dist'));
		return parseFloat(d.get('dist'));
	}
	
	
	
	
	
});