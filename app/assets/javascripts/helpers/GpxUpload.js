CA.Helpers.GpxUploadView = {
	
	initialize: function () {
		var that = this;
		CA.Store.Reader = new FileReader();
		
		$('#files').on('change', that.handleFileSelect);
		
		CA.Store.Reader.onload = function (evt){
			var data = that.parseXML(evt.target.result);
			var gpx = new CA.Models.Gpx(data.gpx);
			//CA.Helpers.GpxUploadView.calcBounds(gpx);	
			gpx.calcBounds();
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
			if (navigator.userAgent.match(/iPad|iPhone|iPad/i) != null){
				$('#geo-modal-btn').click();
			} else {
				fileInput.click();
			}
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
		
}