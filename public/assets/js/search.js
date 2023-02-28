
var Search = {

	init: function(admin){
		console.log('init search')
		$("#submitForm").on('click', function(){
			$("#signin").submit();
		})
	},
}