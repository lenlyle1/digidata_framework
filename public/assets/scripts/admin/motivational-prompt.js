var Moti = {

    init: function(){
        Logging.log('setting up moti prompts');

        $('.motivational-prompt').click(function(e){
            Moti.load($(this).data('prompt_id'));
        });
        $('#motivationalModal').find('.edit-button').click(function(){
            Moti.showForm();
        });
        $('#motivationalModal').find('.update-button').click(function(){
            Moti.save();
        });
        $('#motivationalModal').find('.cancel-button').click(function(){
            Moti.hideForm();
        });
    },

    load: function(promptId){
        Moti.hideForm();
        $modal = $('#motivationalModal').find('.modal-body');
        $form = $modal.find('form')
        Logging.log('Loading prompt');

        $.ajax({
            url: '/api/motivational-prompt/' + promptId+'?auth_id='+auth_id+'&auth_public='+auth_public,
            method: 'GET',
            dataType: 'json',
            success: function(response){
                response = response[0];
                Logging.log(response);

                for(var key in response){
                    $('#motivationalData .'+key).html(response[key]);
                }

                for(var key in response){
                    if(key == 'frequency' || key == 'receive_method' || key == 'start_meridian'){
                        response[key] = response[key].toLowerCase().replace(/ /g, '_');
                    }
                    $('#motivationalData [name='+key+']').val(response[key]);
                }
            }
        })
    },

    save: function(){
        Logging.log('saving');

        var data = $('#motivationalModal').find('form').serializeArray();
        var payload = {};
        payload.user_data = {};

        $(data).each(function(key, item){
            payload.user_data[item['name']] = item['value'];
        });
        Logging.log(payload);

        $.ajax({
            url: '/api/setMotiPrompt',
            method: 'POST',
            data: payload,
            success: function(response){

                location.reload();
            }
        });
    },

    showForm: function(){
        $modal = $('#motivationalModal').find('.modal-body');

        $modal.find('.form-control').show();
        $modal.find('.moti-text').hide();
        $modal.find('.edit-button').hide();
        $modal.find('.update-button').show();
        $modal.find('.cancel-button').show();

    },

    hideForm: function(){
        $modal = $('#motivationalModal').find('.modal-body');

        $modal.find('.form-control').hide();
        $modal.find('.moti-text').show();
        $modal.find('.edit-button').show();
        $modal.find('.update-button').hide();
        $modal.find('.cancel-button').hide();

    }
}



$(document).ready(function(){
    Moti.init();
})
