var rolePermissions = {

    init: function(){
        $('button#save').click(function(){
            rolePermissions.update();
        })
    },

    update: function(){
        $.ajax({
            url: '/admin/role-permissions',
            method: 'POST',
            data: $("#role-permissions").serialize(),
            success: function(response){
                //Logging.log(response);
                    // close popup
                    window.location = '/admin/roles';
            }
        })
    }
}

$(document).ready(function(){
    rolePermissions.init();
})