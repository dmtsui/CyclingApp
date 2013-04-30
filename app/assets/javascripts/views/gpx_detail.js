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
		this.WIDTH = 1600;
		this.HEIGHT = 400,
		this.MARGINS = {top: 20, right: 20, bottom: 20, left: 30};
		this.vis = d3.select('.outside-svg');
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
		that.setDistance();
		return that.data;
	},
	
	setElevation: function () {
		var that = this;
		var data = [];
		_.each(that.data, function(d){
			data.push(parseFloat(d.get('ele')));
		});
		data.sort(function(a, b) {
		    return a - b;
		});
		return [data.shift(), data.pop()];
	},
	
	setDistance: function () {
		var that = this, last = null,
			dList = [], current = null;
			
		_.each(that.data, function(node){
			current = [parseFloat(node.get('lat')), parseFloat(node.get('lon'))];
			if (last == null){
				dList.push(0)
				node.set('dist', 0);
			}else {
				var dist = Math.sqrt(Math.pow((current[0]-last[0]), 2) + Math.pow((current[1]-last[1]), 2));
				dist += dList[dList.length - 1];
				dList.push(dist);
				node.set('dist', dist);
			}
			last = current;
			dList.sort(function(a, b) {
			    return a - b;
			});
			
		});
		return [dList.shift(), dList.pop()];
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
		
		that.vis.append("svg:g").attr("class", "x-axis")
			.attr("transform", "translate(0,"+ (that.HEIGHT - that.MARGINS.bottom) +")").call(that.xAxis);
			
		that.vis.append("svg:g").attr("class", "y-axis")
			.attr("transform", "translate("+ (that.MARGINS.left) +", 0)").call(that.yAxis);
		return that;		
	},
	
	
	plotData: function (data, xfunc, yfunc, xbound, ybound){
		var that = this;
		
		if(xbound != undefined && ybound != undefined){
			that.setBounds(xbound, ybound).setAxis();
			that.vis.select('.x-axis').call(that.xAxis);
			that.vis.select('.y-axis').call(that.yAxis);
		}
		
		// var line = d3.svg.line()
		//     .x(function(d) { return that.xRange ( xfunc(d) ); })
		//     .y(function(d) { return that.HEIGHT - that.yRange ( yfunc(d) ); })
		//     .interpolate("basis");
		// var paths = that.vis.selectAll('path').data(data).attr("d", line);
				
		var circles = that.vis.selectAll("circle")
					  .data(data);
			circles.transition().duration(1000)
				.attr("cx", function (d) { return that.xRange ( xfunc(d) ) })
				.attr("cy", function (d) { return that.HEIGHT - that.yRange ( yfunc(d) ) })
				.attr("r", function (d) { return 7 });
			circles.enter()
				.insert("svg:circle")
				.attr("cx", that.MARGINS.left)
				.attr("cy", that.HEIGHT - that.MARGINS.bottom)
				.attr("r",0)
				.transition().duration(1000)
				.attr("cx", function (d) { return that.xRange ( xfunc(d) ) })
				.attr("cy", function (d) { return that.HEIGHT - that.yRange ( yfunc(d) ) })
				.attr("r", function (d) { return 7 });
			circles.exit()
				.transition().duration(1000)
				.attr("cx", that.MARGINS.left)
				.attr("cy", that.HEIGHT - that.MARGINS.bottom)
				.attr("r",0)
				.remove();
		that.setAxis();
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