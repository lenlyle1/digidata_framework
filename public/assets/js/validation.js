var Validation = {

	checkRequired: function(form){
		var valid = true;
		$('#'+form).find('.required').each(function(){
			if($(this).val() == ''){
				valid = false;
				Form.showError(form, $(this).attr('name'));
			} 
		});
  
		return valid; 
	},

	clearErrors: function(form){ 
		$('#errorBox').addClass('hidden')
		$('.formErrText').remove();
		$('#'+form).find('.formError').each(function(){
			$(this).removeClass('formError'); 
			$(this).prev().removeClass('error');
			$('#errorBox').html();
		});
	} 


} 