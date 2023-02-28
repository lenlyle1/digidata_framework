
var Results = {

	init: function(admin){
		console.log('init results')
		
		$(".user-brief").each(function(index){
			console.log($(this).data('id'));
			$(this).on('click', function(){			
				window.location = "/user/" + $(this).data('id');
			})
		});
	},
}