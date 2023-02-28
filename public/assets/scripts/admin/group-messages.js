var GroupMessage = {

    save: function(){
        Logging.log('Adding message to group');
        Logging.log($("#message").serialize());

        $.ajax({
            url: '/api/groups/message?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: $("#message").serialize(),
            success: function(response){
                Logging.log(response);

                //location.reload();
            }
        })
    },

}
