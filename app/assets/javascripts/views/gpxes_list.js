CA.Views.GpxesList = Backbone.View.extend({
	tagName: "ul",
	className: "dropdown-menu",
	
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
		$dropdown = $('.gpx-menu');
		$dropdown.empty();
		that.collection.each(function(gpx){
			var gpxList = new CA.Views.GpxItem({
				model: gpx
			});	
		$dropdown.append(gpxList.render().$el);
		});
		return that;
	}
	
});