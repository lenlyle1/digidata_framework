var Roles = {

	init: function(){
		$(".module-trigger").change(function(){
			if ($(this).is(':checked')) {
				Roles.addModule($(this));
			} else {
				Roles.removeModule($(this));
			}
		});

		$(".permissionDD").change(function(){
			Log.write('here')
			Roles.changePermission($(this));
		})
	},

	addModule: function(item){
		Log.write('adding module');
		var selectDiv = item.parent().parent().next();
		selectDiv.removeClass('hidden');
		

		$.ajax({
			type: "POST",
			url: '/admin/roles/edit/',
			data: {
				'role_id': item.data('role_id'),
				'module_id': item.data('module_id')
			},
			dataType: "json",
			success: function(response){
				Log.write('done');
			}
		})
	},

	removeModule: function(item){
		Log.write('removing module')
		var selectDiv = item.parent().parent().next();
		selectDiv.addClass('hidden');

		$.ajax({
			type: "POST",
			url: '/admin/roles/edit/',
			data: {
				'role_id': item.data('role_id'),
				'module_id': item.data('module_id'),
				'remove': true
			},
			dataType: "json",
			success: function(response){
				Log.write('done');
			}
		})
	},

	changePermission: function(select){
		
		$.ajax({
			type: "POST",
			url: '/admin/roles/edit/',
			data: {
				'role_id': select.data('role_id'),
				'module_id': select.data('module_id'),
				'permission': select.val()
			},
			dataType: "json",
			success: function(response){
				
			}
		})
	}
}