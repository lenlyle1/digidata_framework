var UserMetas = {

	init: function(){
		$(".meta-trigger").change(function(){
			if ($(this).is(':checked')) {
				UserMetas.ajaxMeta('add', $(this));
			} else {
				UserMetas.ajaxMeta('remove', $(this));
			}
		});
	},

	ajaxMeta: function(action, item){
		$.ajax({
			type: "POST",
			url: '/admin/sites/metas/',
			data: {
				'meta_id': item.data('meta_id'),
				'site_id': item.data('site_id'),
				'action': action
			},
			dataType: "json",
			success: function(response){
				Log.write('done');
			}
		})
	}
}
