CA.Routers.GpxRouter = Backbone.Router.extend({
	routes: {
			   "": "index",
		"gpxes/:id": "graph"
	},
	
	initialize: function($rootEl){
		this.$rootEl = $rootEl;
		
	},
	
	index: function(){
		var that = this;
		var gpxesList = new CA.Views.GpxesList({
			collection: CA.Store.Gpxes
		});
		that.$rootEl.html(gpxesList.render().$el);
	},
	
	graph: function(id) {
		var that = this;
		
		var gpxGraph = new CA.Views.GpxGraph({
			model : CA.Store.Gpxes.get(id)
		});
		
		that.$rootEl.append(gpxGraph.$el);
		CA.Store.Trkpts = CA.Helpers.Cluster.cluster(gpxGraph.setTrkpts(),1);
		
		gpxGraph.render(CA.Store.Trkpts,
							 gpxGraph.setDist, 
							 gpxGraph.setEle,
						 	 gpxGraph.DistBounds,
						     gpxGraph.EleBounds);
		//that.gpxGraph.circles.data(that.gpxGraph.data);
		//$(".gpx-graph").html($('.gpx-graph').html());;
		// setTimeout(function(){
		// 	
		// 	that.gpxGraph.plotData(that.gpxGraph.setRte(), 
		// 					  	that.gpxGraph.setMapXRange, 
		// 						that.gpxGraph.setMapYRange,
		// 						that.gpxGraph.setXMap(),
		// 						that.gpxGraph.setYMap());
		// 	},2000);
		// 	
		// 	setTimeout(function(){
		// 		that.gpxGraph.plotData(that.gpxGraph.setWpts(), 
		// 						  	that.gpxGraph.setMapXRange, 
		// 							that.gpxGraph.setMapYRange,
		// 							that.gpxGraph.setXMap(),
		// 							that.gpxGraph.setYMap());
		// 		},4000);
		// 	
		// 	setTimeout(function(){
		// 		that.gpxGraph.plotData(that.gpxGraph.setRte(), 
		// 						  	that.gpxGraph.setDist, 
		// 							that.gpxGraph.setEle,
		// 							that.gpxGraph.setDistance(),
		// 							that.gpxGraph.setElevation());
		// 		},6000);
	
		
		
		
		
	}
	
});