CA.Helpers.GpxUploadView = {
	
	initialize: function () {
		var that = this;
		CA.Store.Reader = new FileReader();
		
		$('#files').on('change', that.handleFileSelect);
		
		CA.Store.Reader.onload = function (evt){
			var data = that.parseXML(evt.target.result);
			var gpx = new CA.Models.Gpx(data.gpx);
			CA.Helpers.GpxUploadView.calcBounds(gpx);	
			gpx.save({}, {
				success: function (gpx){
					console.log("success hit");
					CA.Store.Gpxes.add(gpx);
					$('#file').text("New Ride!");
					CA.Store.Router.navigate("#/gpxes/"+gpx.get('id'));
				}
			});

		};
		
		var wrapper = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
		var fileInput = $(':file').wrap(wrapper);
	
		fileInput.change(function(){
		    $this = $(this);
		    $('#file').text("Process...");
		})

		$('#file').click(function(){
		    fileInput.click();
		}).show();	
		
	},
	
	handleFileSelect: function (evt) {
		var that = this;
	    var file = evt.target.files; // FileList object
	  	CA.Store.Reader.readAsText(file[0]);
	},
	
	parseXML: function(xml_string){
		var that = this;
		var parsedData = {"gpx":{}};
		
		var parser = new DOMParser();
		var xmlData = parser.parseFromString(xml_string, "text/xml")
		var gpx = xmlData.getElementsByTagName('gpx')[0]
		parsedData.gpx.creator = gpx.getAttribute('creator');
		parsedData.gpx.version = gpx.getAttribute('version');
		parsedData.gpx.time = gpx.getElementsByTagName('metadata')[0]
								 .getElementsByTagName('time')[0]
								 .textContent;
								 
		parsedData.gpx.name = gpx.getElementsByTagName('trk')[0]
							     .getElementsByTagName('name')[0]
								 .textContent;
		
		parsedData.gpx.trk = {};
		parsedData.gpx.trk.trkseg = {};
		parsedData.gpx.trk.trkseg.trkpts = [];	
		
		var trkpts = gpx.getElementsByTagName('trkpt');
		
		_.each(trkpts, function(trkpt_data){
			var trkpt = {};
			trkpt.lat = parseFloat(trkpt_data.getAttribute('lat'));
			trkpt.lon = parseFloat(trkpt_data.getAttribute('lon'));
			trkpt.ele = parseFloat(trkpt_data.getElementsByTagName('ele')[0].textContent);
			trkpt.time = trkpt_data.getElementsByTagName('time')[0].textContent;
			parsedData.gpx.trk.trkseg.trkpts.push(trkpt);
		});
		
		return parsedData;
		
	},
	
	calcBounds: function (gpx) {
		var that = this, lastDist = null;
		var data = gpx.get('trk').get('trkseg').get('trkpts').models;
		
		gpx.set('center',that.calcCenter(data));
		
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
		
		gpx.set('SpeedBounds', [0,maxSpeed]);
		gpx.set('EleBounds', [eleMin, eleMax]);
		gpx.set('DistBounds', [0, totalDist]);
		
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
		
	
}