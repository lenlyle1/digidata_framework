var Spinner = {

	stash: {},

	show: function(target){
		if(typeof target == 'undefined'){
			// no target, show overlay
			Spinner.overlay();
		} else {
			
		}
	},

	overlay: function(){
		var overlay = new Overlay(document.body,{
			id: 'overlay',
			color: '#000',
			duration: 300,
			opacity: 0.4,
			onClick: function() {
				this.close();
			},
			onOpen: function() {
				//make ajax call while the overlay is happening...?
				//var Request = new Request()....
			}
		});

		$(body).append(overlay);
	},

	showOverlay: function(){

	},

	hideOverlay:function(){
		$('#overlay').destroy();
	},

	getSpinner: function(){
		var spinner = '<div class="btn btn-blue" id="spinner"><i class="fa fa-spinner fa-spin"></i></div>';
		return spinner;
	}
}