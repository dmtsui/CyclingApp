CA.Routers.GpxRouter = Backbone.Router.extend({
	routes: {
			   "": "index",
		"gpxes/:id": "graph"
	},
	
	initialize: function($rootEl){
		this.$rootEl = $rootEl;
		this.gpxGraph = new CA.Views.GpxGraph({
			model : CA.Store.Gpxes.get(7)
		});
		
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

		
		that.$rootEl.append(that.gpxGraph.$el);
		that.gpxGraph.render(that.gpxGraph.setWpts());
		//that.gpxGraph.circles.data(that.gpxGraph.data);
		//$(".gpx-graph").html($('.gpx-graph').html());;
		setTimeout(function(){that.gpxGraph.render(that.gpxGraph.setRte())},2000)
		
		
		
	}
	
});