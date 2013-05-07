window.CA = {
	Models: {},
	Views: {},
	Collections: {},
	Routers: {},
	Store: {},
	Helpers: {},
	
	initialize: function($rootEl){
		CA.Store.Router = new CA.Routers.GpxRouter($rootEl);
		Backbone.history.start();
	}
	
}