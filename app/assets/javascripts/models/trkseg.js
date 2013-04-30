CA.Models.Trkseg = Backbone.RelationalModel.extend({
	
	relations:[{
		type: Backbone.HasMany,
		key: 'trkpts',
		relatedModel: 'CA.Models.Trkpt',
		collectionType: 'CA.Collections.Trkpts',
		reverseRelation: {
			key: 'trkseg'	
		}	
	}]
	
});