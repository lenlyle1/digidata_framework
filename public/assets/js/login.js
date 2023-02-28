var Login = {

	init: function(admin){
		console.log('init')
		$("#submitForm").on('click', function(){
			$("#signin").submit();
		})
	},

	fbLogin: function(signup){
		Log.write('check login status');
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				 // the user is logged in and has authenticated your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token 
				// and signed request each expire
				Login.parseFB(response, signup);
			} else if (response.status === 'not_authorized') {
				// the user is logged in to Facebook, 
				// but has not authenticated your app
				Log.write('not connected')
				FB.login(
			        function(response) {
			      		Login.parseFB(response, signup);
			        }
		    	);    		
			} else {
				Log.write('not logged in')
				FB.login(
			        function(response) {
			      		Login.parseFB(response, signup);
			        }
		    	);    			
			}
		});
	}, 
	
	parseFB: function(response, signup){
		var uid = response.authResponse.userID;
		var accessToken = response.authResponse.accessToken;

		if(response.status === 'connected'){
			if(signup){
				Log.write('here')
				Log.write(response)
				Signup.getFBdetails();
				FB.logout()
			}
		}
	},
}