CA.Models.Trk = Backbone.RelationalModel.extend({
	
	relations:[{
		type: Backbone.HasOne,
		key: 'trkseg',
		relatedModel: 'CA.Models.Trkseg',
		reverseRelation: {
			key: 'trk'	
		}	
	}]
	
});