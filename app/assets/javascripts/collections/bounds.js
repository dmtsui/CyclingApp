CA.Collections.Bounds = Backbone.Collection.extend({
	model: CA.Models.Bound,
	url: function(){
		return 'gpxes/' + this.gpx.id + "/bounds"
	}
});