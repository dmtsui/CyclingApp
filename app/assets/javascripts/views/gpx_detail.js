CA.Views.GpxGraph = Backbone.View.extend({
	tagName: "div",
	className: "gpx-graph",
	
	attributes: {
	},
	
	events: {
		"click svg": "setWpts"
	},
	
	initialize: function(){
		this.data = this.setWpts();
		this.r = 10;
		this.xRange;
		this.yRange;
		this.WIDTH = 600;
		this.HEIGHT = 400,
		this.MARGINS = {top: 20, right: 20, bottom: 20, left: 30};
		this.vis = d3.select('.outside-svg');
	},
	
	render: function(data){
		var that = this;
		
		that.setRange().setAxis().drawAxis();		
		that.plotData(data);
		
		return that;
	},
	
	setRte: function(){
		var that = this;
		return that.model.get( 'rtes' ).first().get('rtepts').models;
	},
	
	setWpts: function(){
		var that = this;
		return that.model.get( 'wpts' ).models;	
	},
	
	setElevation: function () {
		
	},
	
	setRange: function (xbound, ybound){		
		var that = this;
		
		xbound = xbound || d3.scale.linear()
					.range ([that.MARGINS.left, that.WIDTH - that.MARGINS.left])
					.domain([that.model.get('bound')
							.get('minlat'), that.model.get('bound').get('maxlat')]);
		
		ybound = ybound || d3.scale.linear()
					.range ([that.MARGINS.bottom, that.HEIGHT - that.MARGINS.bottom])
					.domain([that.model.get('bound')
							.get('minlon'), that.model.get('bound').get('maxlon')]);
	
		that.xRange = xbound;				
		that.yRange = ybound;
		
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
		
		that.vis.append("svg:g").attr("class", "x axis")
			.attr("transform", "translate(0,"+ (that.HEIGHT - that.MARGINS.bottom) +")").call(that.xAxis);
			
		that.vis.append("svg:g").attr("class", "y axis")
			.attr("transform", "translate("+ (that.MARGINS.left) +", 0)").call(that.yAxis);
		return that;		
	},
	
	plotData: function (data){
		var that = this;
				
		var circles = that.vis.selectAll("circle")
					  .data(data, function (d) { return d.get('name') });
			circles.enter()
				.insert("svg:circle")
				.attr("cx", that.MARGINS.left)
				.attr("cy", that.HEIGHT - that.MARGINS.bottom)
				.attr("r",0)
				.transition().duration(1000)
				.attr("cx", function (d) { return that.xRange (parseFloat(d.get('lat'))) })
				.attr("cy", function (d) { return that.yRange (parseFloat(d.get('lon'))) })
				.attr("r", function (d) { return 7 });
			circles.exit()
				.transition().duration(1000)
				.attr("cx", that.MARGINS.left)
				.attr("cy", that.HEIGHT - that.MARGINS.bottom)
				.attr("r",0)
				.remove();
		that.setAxis();
	}
	
	
	
});