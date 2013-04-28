CA.Views.GpxItem = Backbone.View.extend({
	tagName: 'li',
	className: "gpx",
	
	events:{
	},
	
	render: function(){
		var that = this;
		var $link = $("<a>").attr("href", "#/gpxes/" + that.model.id) ;
		that.$el.append($link.html("GPX#"+that.model.id));
		return that;
	}
	
});