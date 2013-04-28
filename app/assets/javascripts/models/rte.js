CA.Models.Rte = Backbone.RelationalModel.extend({
	relations:[{
		type: Backbone.HasMany,
		key: 'rtepts',
		relatedModel: 'CA.Models.Rtept',
		collectionType: 'CA.Collections.Rtepts',
		
		reverseRelation: {
			key: 'rte'	
		}	
	}]
});