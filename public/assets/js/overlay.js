/**
	Overlay generating class
**/
function Overlay(_options){

	var self = this, overlay;
		
	var options = {
		id: 'overlay',
		color: '#000',
		duration: 500,
		opacity: 0.5,
		clickToClose: false,
		closeCallback: null,
		container: 'body'
	}
	
	this.init = function(_options) {
		this.setupOptions(_options);
		this.open()
	}

	this.setupOptions = function(_options){
		$.each(_options, function(index, value){
			options[index] = value;
		})
	}

	this.open = function() {
		$("<div>", {
		    'id': options.id,
		    css: {
		        "opacity": options.opacity,
		        "background-color": options.color,
		        "width": "100%",
		        "height": "100%",
		        "position": "absolute",
		        "text-align": "center",
		        "top": "0",
		        "position": "fixed"
		    }
		}).appendTo(options.container);

		$("#" + options.id).click(this.close)
	}

	this.setScroll = function(){

	}

	this.close = function() {
		if(options.clickToClose){
			$("#" + options.id).remove();
		}

		if(options.closeCallback){
			options.closeCallback();
		}
	}

	this.init(_options);
}