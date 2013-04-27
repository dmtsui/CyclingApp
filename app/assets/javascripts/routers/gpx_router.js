CA.Routers.GpxRouter = Backbone.Router.extend({
	routes: {
		"": "index"
	},
	
	initialize: function($rootEl){
		this.$rootEl = $rootEl;
	},
	
	index: function(){
		var that = this;
		console.log("went through router");	
	}
});