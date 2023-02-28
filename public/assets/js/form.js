var Form = {

	showError: function(form, field, error){
		Log.write('showing error for ' + field);

		$('#' + form +' :input').each(function(index, input){
			if($(input).val() == ''){
				$(input).addClass('formError'); 
			}
		});

		var formItem = $('#' + form + " [name='" + field + "'");
		formItem.addClass('formError'); 

		if(formItem.prev().prop("tagName") == 'LABEL'){
			formItem.prev().addClass('error'); 
		}
		if(typeof error != 'undefined'){
			Form.clearErrors(form);
			formItem.before('<div class="error">' + error + '</div>');
		}
	},

	clearErrors: function(form){
		$(".error").remove();
	},

	spinButton: function(button){
		$(button).addClass('hidden');
		$(button).after(Spinner.getSpinner());
	},

	restoreButton: function(button){
		$('#'+button).removeClass('hidden');
		$("#spinner").remove();
	}
}