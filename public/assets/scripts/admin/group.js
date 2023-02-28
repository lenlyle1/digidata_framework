var Group = {

    init: function(){
        $('.save').click(function(){
            var type = $(this).data('type');

            if(type == 'member') {
                GroupMember.save();
            } else if(type == 'note'){
                GroupNote.save();
            } else if(type == 'message'){
                GroupMessage.save();
            } else {
                Group.submitGroup($(this).data('reload'));
            }
        });

        $('.remove-note').click(function(){
            GroupNote.delete($(this).data('group_note_id'));
        })
        //$('#group_popup').popup();

        $('#edit-group').click(function(){
            $('#group-values').hide()
            $('#group-editor').show()
            $('#edit-group').hide()
            $('#cancel-group').show()
            $('#update-group').show()
        });
        $('#cancel-group').click(function(){
            $('#group-values').show()
            $('#group-editor').hide()
            $('#edit-group').show()
            $('#cancel-group').hide()
            $('#update-group').hide()
        });
        $('#update-group').click(function(){
            Group.submitGroup(false);
        });

        $('button#cancel').click(function(){
            $("#group_popup").popup('hide');
        });

        $('.add-new').on('click', function(){
            //$('#group_popup').popup('show');
            $('#group_popup input, select').val('');
        });

        $('.remove-member').click(function(){
            Logging.log('removing member')
            GroupMember.remove($(this).data('user_id'), $(this).data('group_id'))
        })

        //$('.modal').popup();

        $("#importer").popup({
            'beforeopen': function(){

            }
        });

        $('.add-item').click(function(){
            var itemType = $(this).data('item-type');
            Logging.log('Adding ' + itemType)
        });

        $('.remove-member').each(function(){
            var userId = $(this).data('user_id');
            $("#add-users option[value='"+userId+"']").remove();
        });

        $('#group-tabs').tabs({ active: 0 });

    },

    submitGroup: function(reload){
        $(".form-error").remove();
        $.ajax({
            url: '/api/group?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: $("#group-form").serialize(),
            success: function(response){

                if(!response.success){
                    $.each(response.errors, function(field, errors){
                        if(errors.constructor === Array){
                            $.each(errors, function(id, error){
                                FormError.showError(field, error);
                            });
                        } else {
                            FormError.handleError(errors);
                        }
                    })
                } else {
                    if(reload){
                        location.reload();
                    } else {
                        $('#group-name-text').html($("#group-form input[name=name]").val());
                        $('#group-leader-text').html($("#group-form select[name=group_leader_id] option:selected").text());
                        $('#group-description-text').html($("#group-form input[name=description]").val());
                        $('#group-values').show()
                        $('#group-editor').hide()
                        $('#edit-group').show()
                        $('#cancel-group').hide()
                        $('#update-group').hide()
                    }
                }
            }
        });
    }
}

$(document).ready(function(){
    Group.init();
})
