var GroupMember = {

    save: function(){
        Logging.log('Adding user to group');

        if($('#member-form select[name=user_id]').val() == ''){
            Logging.log('No user selected');
            return;
        }

        Logging.log($("#member-form-items").serialize());

        $.ajax({
            url: '/api/group/add-user?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: $("#member-form-items").serialize(),
            success: function(response){
                location.reload();
            }
        })
    },

    remove: function(userId, groupId){
        $.ajax({
            url: '/api/group/remove-user?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: {'user_id': userId, 'group_id': groupId},
            success: function(response){
                location.reload();
            }
        })
    }
}
