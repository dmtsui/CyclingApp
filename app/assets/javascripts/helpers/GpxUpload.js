CA.Helpers.GpxUploadView = {
	
	initialize: function () {
		var that = this;
		var reader = new FileReader();
		
		$('#files').on('change', that.handleFileSelect);
		
		reader.onload = function (evt){
			var gpx = new CA.Models.Gpx();			
			gpx.save({ data: evt.target.result }, {
				success: function (gpx, rsp){
					console.log("success hit");
					console.log(rsp);
					CA.Store.Gpxes.add(new CA.Models.Gpx(rsp))
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
	    var file = evt.target.files; // FileList object
	  	reader.readAsText(file[0]);
	},	

	
	
}