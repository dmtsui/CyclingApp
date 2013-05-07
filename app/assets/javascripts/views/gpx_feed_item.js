CA.Views.GpxFeedItem = Backbone.View.extend({
	tagName: 'li',
	className: "gpx-feed-item",
	
	events:{
	},
	
	render: function(){
		var that = this;
		
		var img = new Image();
		img.setAttribute('height', 300);
		img.setAttribute('width', 500);
		img.src = that.model.get('image');
		
		
		var $link = $("<a>").attr("href", "#/gpxes/" + that.model.id);
		$link.append(img);
		$link.append(that.model.get('name'));
		
		that.$el.append($link);
		return that;
	}
	
});

