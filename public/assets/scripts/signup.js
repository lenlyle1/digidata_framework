var Signup = {
    init: function(){
        $('#signUp').click(function(e){
            e.preventDefault();
            Signup.signup();
        })
    },

    signup: function(){
        console.log('signing up')

        $.ajax({
            url: '/user/signup',
            method: 'POST',
            data: $("#userForm").serialize(),
            success: function(response){
                console.log(response);
                    // close popup
                //window.location = '/admin/roles';
            }
        })
    }
}



$(document).ready(function(){
    Signup.init();
})