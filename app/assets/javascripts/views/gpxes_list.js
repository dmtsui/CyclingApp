CA.Views.GpxesList = Backbone.View.extend({
	tagName: "ul",
	className: "gpxes-list",
	
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
		that.collection.each(function(gpx){
			var gpxList = new CA.Views.GpxItem({
				model: gpx
			});
			that.$el.append(gpxList.render().$el);
		});
		return that;
	}
	
});