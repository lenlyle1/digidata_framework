/**
  * Error handling class, to allow fancier errors later
**/
var Error = {

	display: function(error, isError){
		this.popup(error);
	},

	popup: function(error, isError){
		var popup = new Popup({
			id: 'popup',
			color: '#000',
			clickToClose: true,
			closeBar: true,
			content: '<div class="error">'+error+'</div',
			hasOverlay: true
		});

		popup.open();

	}
}