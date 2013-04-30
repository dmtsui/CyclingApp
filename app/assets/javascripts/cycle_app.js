window.CA = {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Store: {},
	Helpers: {},
	
	initialize: function($rootEl){
		new CA.Routers.GpxRouter($rootEl);
		Backbone.history.start();
	}
	
}