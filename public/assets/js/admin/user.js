var User = {

	init: function(){
		$("#userSearch").click(function(){
			User.search();
		})
	},

	search: function(){
		if($("#searchEmail").val() != ''){

		} else {
			Error.display('You must enter an email');
		}
	}
}