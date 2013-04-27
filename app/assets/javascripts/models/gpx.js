CA.Models.Gpx = Backbone.RelationalModel.extend({
	urlRoot: 'gpxes',
	
	relations:[{
		type: Backbone.HasMany,
		key: 'wpts',
		keyDestination: 'wpts_attributes',
		relatedModel: 'CA.Models.Wpt',
		collectionType: 'CA.Collections.Wpts',
		
		reverseRelation: {
			key: 'gpx'	
		}	
	},
	{
		type: Backbone.HasOne,
		key: 'bound',
		keyDestination: 'bound_attributes',
		relatedModel: 'CA.Models.Bound',
		reverseRelation: {
			key: 'gpx'	
		},
	}]		
});