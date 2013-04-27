CA.Models.Wpt = Backbone.RelationalModel.extend({
	urlRoot: function(){
		return 'gpxes/' + this.gpx.id + '/wpts/'
	}
});