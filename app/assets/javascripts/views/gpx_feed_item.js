CA.Views.GpxFeedItem = Backbone.View.extend({
	tagName: 'li',
	className: "span4",
	
	events:{
	},
	
	render: function(){
		var that = this;
		
		var img = new Image();
		img.setAttribute('height', 300);
		img.setAttribute('width', 500);
		img.src = that.model.get('image');
		
		// <li class="span4">
		//     <div class="thumbnail">
		//       <img data-src="holder.js/300x200" alt="">
		//       <h3>Thumbnail label</h3>
		//       <p>Thumbnail caption...</p>
		//     </div>
		//   </li>
		
		var $thumbnail = $("<div>").attr("class", "thumbnail");
		var $link = $("<a>").attr("href", "#/gpxes/" + that.model.id);
		$link.append(img);
		$thumbnail.append($link);
		$thumbnail.append($("<h3>").html(that.model.get('name')));
		$thumbnail.append($("<p>").html(that.model.get('creator')));
		
		that.$el.append($thumbnail);
		return that;
	}
	
});

