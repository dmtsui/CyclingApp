CA.Routers.GpxRouter = Backbone.Router.extend({
	routes: {
			   "": "index",
		"gpxes/:id": "graph",
		"gpxes/new": "graph"
	},
	
	initialize: function($rootEl){
		this.$rootEl = $rootEl;
		
	},
	
	
	feed: function(){
		var that = this;
		
	},
	
	index: function(){
		var that = this;
		var gpxesList = new CA.Views.GpxesList({
			collection: CA.Store.Gpxes
		});
		gpxesList.render();	
		
		var gpxesFeedList = new CA.Views.GpxesFeedList({
			collection: CA.Store.Gpxes
		});
		gpxesFeedList.render();	
		
		
	},
	
	graph: function(id, model) {
		$('a[href=#tab2]').tab('show');
		
		var that = this;
		
		that.index();
		
		var currentModel = CA.Store.Gpxes.get(id) || CA.Store.Gpx;
		console.log("made it here");
		
		if (currentModel.get('trk') == null){
			currentModel.fetch({
				success: function(){
					that.renderGraph(currentModel);
				}
			});
		} else {
			that.renderGraph(currentModel);
		}
		
		
	},
	renderGraph: function(currentModel){
		var that = this;
		var gpxGraph = new CA.Views.GpxGraph({
			model : currentModel
		});
		
		that.$rootEl.html(gpxGraph.$el);
		//CA.Store.Trkpts = CA.Helpers.Cluster.cluster(gpxGraph.setTrkpts(),2);
		
		gpxGraph.render(gpxGraph.setDist, gpxGraph.setEle);	
	}
	
});