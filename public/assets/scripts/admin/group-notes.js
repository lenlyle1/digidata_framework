var GroupNote = {

    save: function(){
        Logging.log('Adding note to group');

        $.ajax({
            url: '/api/group/add-note?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: $("#note-form-items").serialize(),
            success: function(response){
                location.reload();
            }
        })
    },

    delete: function(group_note_id) {
        Logging.log('deleting note');

        $.ajax({
            url: '/api/group/delete-note?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: {group_note_id: group_note_id},
            success: function(response){
                location.reload();
            }
        })
    }
}
