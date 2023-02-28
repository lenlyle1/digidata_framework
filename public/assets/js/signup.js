var Signup = {

	init: function(){
		$("#submitForm").click(function(){
			var form = 'signup';
			Validation.clearErrors(form);
			Signup.submitSignup(form);
		});
		$("input[name='password']").focus(function(){
            this.type="text";
		}).blur(function(){
            this.type="password";
		})
	},

	validate: function(form){
		if(!Validation.checkRequired(form)){
			Alert.error('Fields in red are required');
			return false;
		}

		return true;
	},

	showhidePass: function(box){
		Log.write(box);
	},

	submitSignup: function(form){
		var valid = false;

		if(Signup.validate(form)){
			if(Signup.testRecaptcha()){
				valid = true; 
			} 
		}
		
		if(valid){
			Log.write('submitting');
			var url = '/user/signup';

			$.ajax({
				type: "POST",
				url: url,
				data: $("#" + form).serializeArray(),
				dataType: "json",
				success: function(response){
					Log.write('done');
					if(response.success == false){
						$.each(response.errors, function(i, value){
							Form.showError(form, i, value);
							Alert.error(value);
							Log.write(i +":" + value);
						})
					} else {
						Log.write('success');

					}
				}
			})
		}
		
	},

	testRecaptcha: function(){
		if($("#g-recaptcha-response").val() == ''){
			Alert.popup('error', 'You must prove you are human');
			$('.g-recaptcha').addClass('formError')
			return false;
		}

		return true;
	},

	fbSignup: function(){
		Login.fbLogin(true);
	},

	getFBdetails: function(){

		FB.api('/me?fields=id, first_name, last_name, email, age_range, gender, locale, timezone', function(response) {
			//Log.write(response);
          	//Log.write(response.first_name + ':' + response.email);
          	$('.fbSignup').remove();
          	Log.write('signed in');
      		$('#firstInput').val(response.first_name);
      		$('#lastInput').val(response.last_name);
      		$('#emailInput').val(response.email);
      		if(response.gender == 'male'){
      			$('#genderSelect').val('m');
      		} else if(response.gender == 'female'){
      			$('#genderSelect').val('f');
      		}

      		return true
        });

	    FB.api('/me/picture?type=large&width=600', function(response) {
	      	//Log.write(response.data.url);
      		$('#fbPicture').val(response.data.url);
      	})	
	},
}