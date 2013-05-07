CA.Views.GpxesFeedList = Backbone.View.extend({
	tagName: "ul",
	className: "gpxes-feed-list",
	
	events: {
		
	},
	
	initialize: function (){
		var that = this;
		that.collection.on('add reset', function(){
			this.$el.empty();
			this.render();
		}, this);
	},
	
	render: function(){
		var that = this;
		$feedContainer = $('#feed-container');
		$feedContainer.empty();
		that.collection.each(function(gpx){
			var gpxFeedList = new CA.Views.GpxFeedItem({
				model: gpx
			});	
			$feedContainer.append(gpxFeedList.render().$el);
		});
		return that;
	}
	
});