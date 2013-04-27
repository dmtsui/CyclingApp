CA.Collections.Wpts = Backbone.Collection.extend({
	model: CA.Models.Wpt,
	url: function(){
		return "gpxes/" + this.gpx.id + "/wpts"
	}
});