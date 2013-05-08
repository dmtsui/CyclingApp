CA.Views.GpxesFeedList = Backbone.View.extend({
	tagName: "ul",
	className: "thumbnails",
	
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
			that.$el.append(gpxFeedList.render().$el);
		});
		return that;
	}
	
});