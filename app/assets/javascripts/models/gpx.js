CA.Models.Gpx = Backbone.RelationalModel.extend({
	urlRoot: "gpxes/",
	
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
		key: 'trk',
		relatedModel: 'CA.Models.Trk',
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
	}],
	
	calcBounds: function () {
		var that = this, lastDist = null;
		var data = that.get('trk').get('trkseg').get('trkpts').models;
		
		that.set('center',that.calcCenter(data));
		
		that.latlngs = [];
	
		var eleMax = data[0].get('ele');
		var eleMin = eleMax;
		
		var totalDist = 0;
		
		var maxSpeed = 0;
		var allSpeeds = [];
		var lastTime;
		CA.Store.totalTime = 0;
			
		_.each(data, function(node){
			that.latlngs.push(new L.LatLng(node.get('lat'),node.get('lon')));
			var currentEle = node.get('ele');
			if (currentEle > eleMax){ eleMax = currentEle; }
			if (currentEle < eleMin){ eleMin = currentEle; }
			
			var currentDist = [node.get('lat'), node.get('lon')];
			
			if (lastDist == null){
				node.set('dist', 0);
				allSpeeds.push(node.set('speed', 0));
				lastTime = new Date(node.get('time'));
	
			}else {
				var dist = Math.sqrt(Math.pow((currentDist[0]-lastDist[0]), 2) + Math.pow((currentDist[1]-lastDist[1]), 2));
				dist *= 62.1371;
				totalDist += dist;
				node.set('dist', totalDist);
				var currentTime = new Date(node.get('time'));
				var speed = that.calcSpeed(currentTime, lastTime, dist);
				if (speed > maxSpeed){ maxSpeed = speed; }
				node.set('speed', speed);
				allSpeeds.push(speed);
				lastTime = currentTime;
			}
			lastDist = currentDist;
			
			
		});
		allSpeeds.sort();
		
		that.set('SpeedBounds', [0,maxSpeed]);
		that.set('EleBounds', [eleMin, eleMax]);
		that.set('DistBounds', [0, totalDist]);
		
		return true;
	},
	
	calcSpeed: function (currentTime, lastTime, dist) {
		var time = parseInt(currentTime - lastTime)/(3600000);
		CA.Store.totalTime += time;
		return ( dist/time );
	},	
	
	calcCenter: function(data){
		var that = this;
		var length = data.length;
		var segment = Math.floor(length/4);
		var xs = 0;
		var ys = 0;
		for(var i = 0; i < 5; i++){
			var datum = data[i*segment];
			xs += datum.get('lat');
			ys += datum.get('lon');
		}
		
		return [xs/5, ys/5];
	},	
});