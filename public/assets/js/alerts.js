/**
  * Alert handling class, to allow fancier errors later
**/
var Alert = {

	display: function(error, isError){
		this.popup(error);
	},

	popup: function(type, msg){
		var popup = new Popup({
			id: 'popup',
			color: '#000',
			clickToClose: true,
			closeBar: true,
			content: '<div class="'+type+'">'+msg+'</div',
			hasOverlay: true
		});

		popup.open();
	},

	message: function(msg){
		Alert.popup('message', msg);
	},

	error: function(msg){
		$('html, body').animate({scrollTop : 0}, 500);
		Alert.popup('error', msg);
	}
}