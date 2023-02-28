function Popup(_options){

	var self = this;
	
	var options = {
		id: 'popup',
		clickToClose: false,
		closeBar: true,
		hasOverlay: true,
		width: 200,
		content: null,
		height: 200,
		overlayId: 'overlay1',
		container: 'body'
	}
	
	this.init = function(newOptions) {
		if(typeof newOptions != 'undefined'){
			this.setupOptions(newOptions);
		}
	}

	this.setupOptions = function(newOptions){
		$.each(newOptions, function(index, value){
			options[index] = value;
		})
	}

	this.open = function(){
		if(options.hasOverlay){
			this.showOverlay();
		}

		var container = (options.hasOverlay) ? "#" + options.overlayId : "body";

		$("<div>", {
		    'id': options.id,
		    'class': 'popup',
		    css: {
		        "background-color": '#fff',
		        "opacity": 1,
		        "width": options.width + 'px',
		        'margin-left': '-' + (options.width / 2) + 'px',
		        'margin-top': '-' + (options.height / 2) + 'px',
				'top': '50%',
				'left': '50%',
		        "position": "absolute",
		        "position": "fixed"
		    }
		}).appendTo('body');

		this.recenter();

		if(options.closeBar){
			var closebar = '<div class="closeBar"><div class="x right">X</div></div>';
			$('#'+options.id).append(closebar);
			$('#'+options.id).find('.x').click(function(){
				self.close()
			})
		}
		// close button
		var closeButton = '<div class="right btn btn-close">Close</div>';
		$('#'+options.id).append('<div class="popupContent">'+options.content+'</div>');
		$('#'+options.id).append(closeButton);
		$('#'+options.id).find('.btn-close').click(function(){
			self.close()
		})
	}

	this.showOverlay = function(){
		var container = (options.hasOverlay) ? "#" + options.overlayId : "body";
		self.overlay = new Overlay({
			id: options.overlayId,
			color: '#000',
			duration: 500,
			opacity: 0.5,
			clickToClose: options.clickToClose,
			closeCallback: function(){
				$('#' + options.id).remove();
			},
			container: options.container
		});
	}

	this.close = function(){		
		$('#' + options.id).remove();
		$('#' + options.overlayId).remove();		
	}

	this.resize = function(){

	}

	this.recenter = function(){

	}

	this.init(_options);
}