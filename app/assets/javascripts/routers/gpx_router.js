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
		$('#feed-container').html(gpxesFeedList.render().$el);	
		CA.Store.GeoLocation = new CA.Models.Gpx();
		var geoView = new CA.Views.GeoLocationView({
			model: CA.Store.GeoLocation
		});
		$('.geo-body').html(geoView.render().$el);	
		
		
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
		
		if (that.gpxGraph !== undefined){
			CA.Store.Marker.off('click');

			that.gpxGraph.vis.on('mousemove', null);
			that.gpxGraph.vis.on('mouseout', null);
			that.gpxGraph.vis.on('touchmove', null);

			that.gpxGraph.remove();
		}
		
		that.gpxGraph = new CA.Views.GpxGraph({
			model : currentModel
		});
		
		that.$rootEl.html(that.gpxGraph.$el);
		
		that.gpxGraph.render(that.gpxGraph.setDist, that.gpxGraph.setEle);	
	}
	
});