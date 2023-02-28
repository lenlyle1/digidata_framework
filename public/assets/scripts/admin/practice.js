var Practice = {

    init: function(){
        $('#save').click(function(){
            Practice.submitPractice();
        })

        $('#practice_popup').popup();

        $('button#cancel').click(function(){
            $("#practice_popup").popup('hide');
        })

        $('.add-new').on('click', function(){
            $('#practice_popup').popup('show');
            $('#practice_popup input, select').val('');
            $('button#save').html('Add Practice');
        })

        $('button.edit-button').click(function(){
            Practice.editPractice($(this));
        })

        $('#myModal').on('shown.bs.modal', function () {
            Practice.editPractice();
        })
    },

    editPractice: function(button){
        Logging.log('editing');
        $(".form-error").remove();
        var data = $(button).data();
        // Defer until after jQuery is done
        setTimeout(function() {
            var form = $('#practice-form');
            form.prepend('<input type="hidden" name="practice_id" id="practice_id" value="' + data['id'] + '" />');
            form.find('[name=name]').val(data['name']);
            form.find('[name=abbreviation]').val(data['abbreviation']);
            form.find('[name=condition]').val(data['condition_id']);
        }, 0);
    },

    submitPractice: function(){
        $(".form-error").remove();
        $.ajax({
            url: '/api/practice?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: $("#practice-form").serialize(),
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
                    // close popup
                    location.reload();
                }
            }
        });
    },


    updatePractice: function(row){
        Logging.log('updating');
        Logging.log(row);

        var data = {practice_id: $(row).data('id'),
                   name: $(row).find('td:nth-child(1) textarea').val(),
                   abbreviation: $(row).find('td:nth-child(2) textarea').val(),
                   condition: $(row).find('td:nth-child(3) textarea').val()}

        Logging.log(data);

        $.ajax({
            url: '/api/practice?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'POST',
            data: data,
            success: function(response){

                if(!response.success){
                    Logging.log('Practice save failed');
                    Logging.log(response.errors);
                } else {
                    Logging.log(response)
                    // close popup
                    //location.reload();
                }
            }
        });
    },
}

$(document).ready(function(){
    Practice.init()
})
