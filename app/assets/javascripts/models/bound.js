CA.Models.Bound = Backbone.RelationalModel.extend({
	urlRoot: function(){
		return 'gpxes/' + this.gpx.id + "/bounds"
	}
});