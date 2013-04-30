CA.Helpers.Cluster = {
	cluster: function(data, tolerance){
		var that = this;
		var clustered_data = [data[0]];
		
		var origin_datum = data[0];
		var origin_slope = that.slope( that.parse(data[1]), that.parse(origin_datum));

		var last_datum;
		
		var length = data.length;
						
		_.each(data.slice(1), function(datum){
			var current = that.parse(datum);
			//console.log(that.slope( that.parse(datum), origin));
			//console.log( [Math.abs(that.expectedEle(origin_datum, origin_slope, current[0])) , Math.abs(current[1])] );
			if ((Math.abs(that.expectedEle(origin_datum, origin_slope, current[0]) - current[1])) > tolerance){
				
				clustered_data.push(last_datum);
				origin_datum = last_datum;
				origin = that.parse(last_datum);
				origin_slope = that.slope(current, origin);;
			}
			
			last_datum = datum;
			
		});
		clustered_data.push(data[length -1])
		
		return clustered_data;
		
	},
	
	expectedEle: function(origin_datum, origin_slope, x){
		var m = origin_slope;
		var b = parseFloat(origin_datum.get('ele'));
		return (m*x + b);
	},
	
	parse: function(datum){
		return [parseFloat(datum.get('dist')), parseFloat(datum.get('ele'))];
	},
	
	slope: function(d1, d2){
		var x = d2[0] - d1[0];
		var y = d2[1] - d1[1];
		
		return parseFloat(y/x);
	},
	
	setDistance: function (data) {
		//console.log('setDistance');
		var that = this, last = null,
			dList = [], current = null;
			
		_.each(data, function(node){
			current = [parseFloat(node.get('lat')), parseFloat(node.get('lon'))];
			if (last == null){
				dList.push(0)
				node.set('dist', 0);
			}else {
				var dist = Math.sqrt(Math.pow((current[0]-last[0]), 2) + Math.pow((current[1]-last[1]), 2));
				dist += dList[dList.length - 1];
				dList.push(dist);
				node.set('dist', dist);
			}
			last = current;
			dList.sort(function(a, b) {
			    return a - b;
			});
			
		});
		return [dList.shift(), dList.pop()];
	}
	
}