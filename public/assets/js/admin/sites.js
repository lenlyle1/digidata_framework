Sites = {
	
	init: function(){
		Log.write('init');
		$("#submitNewSite").click(function(){
			$("#addSite").submit();
		});

		$("#saveSite").click(function(){
			$("#siteEdit").submit();
		});

		$("#statusDD").change(function(){
			Log.write( $("#siteId").val());
			Log.write( $(this).val());
			Sites.changeStatus($("#siteId").val(), $(this).val(), true);
		})

		$(".deleteSite").click(function(){
			Sites.changeStatus($(this).data('site_id'), 'deleted', true);
		})

		$("#saveImage").click(function(){
			Log.write('uploading image');
			$("#imageEdit").submit();
		})
	},

	changeStatus: function(siteId, status, reload){
		$.ajax({
			type: "POST",
			url: '/admin/sites/change-status/',
			data: {
				'siteId': siteId,
				'status': status
			},
			dataType: "json",
			success: function(response){
				if(typeof reload != 'undefined'){
					window.location.reload(false); 
				}
			}
		})
	},

}
