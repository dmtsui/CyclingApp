CA.Helpers.GpxUploadView = {
	
	initialize: function () {
		var that = this;
		CA.Store.Reader = new FileReader();
		
		$('#files').on('change', that.handleFileSelect);
		
		CA.Store.Reader.onload = function (evt){
			var gpx = new CA.Models.Gpx();			
			gpx.save({ data: evt.target.result }, {
				success: function (gpx){
					console.log("success hit");
					CA.Store.Gpxes.add(gpx);
					$('#file').text("New Ride!");
				}
			});
		};
		
		var wrapper = $('<div/>').css({height:0,width:0,'overflow':'hidden'});
		var fileInput = $(':file').wrap(wrapper);
	
		fileInput.change(function(){
		    $this = $(this);
		    $('#file').text("File attached");
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

	
	
}