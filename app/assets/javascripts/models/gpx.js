CA.Models.Gpx = Backbone.RelationalModel.extend({
	urlRoot: 'gpxes',
	
	relations:[{
		type: Backbone.HasMany,
		key: 'wpts',
		relatedModel: 'CA.Models.Wpt',
		collectionType: 'CA.Collections.Wpts',
		
		reverseRelation: {
			key: 'gpx'	
		}	
	},	
	{
		type: Backbone.HasMany,
		key: 'rtes',
		relatedModel: 'CA.Models.Rte',
		collectionType: 'CA.Collections.Rtes',
		reverseRelation: {
			key: 'gpx'	
		}		
	},
	{
		type: Backbone.HasOne,
		key: 'bound',
		relatedModel: 'CA.Models.Bound',
		reverseRelation: {
			key: 'gpx'	
		},
	}]		
});