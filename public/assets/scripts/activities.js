$(document).ready(function(){
    var selected_batch_id = null;
    bindSurveyClick();
    bindAPClick();
    bindMotivation();
    bindAPActionClick();
    bindSurveyResume();
    bindMotiToggle();
    bindMotiShower();
    bindMotiEdit();
    bindMotiUpdate();
});

var bindSurveyClick = function() {
    $('body').on('click', 'tr.survey_row', function(){
        console.log ( $(this).data('batch_id'));
    });
}

var bindAPClick = function() {
    $('body').on('click', 'tr.ap_row', function(){
        console.log ( $(this).data('batch_id'));
    });
}

var bindMotiUpdate = function(){
    $('body').on('click', '.moti_save', function(){
        console.log('saving batch_id', selected_batch_id);

        var post_obj = {};
        $.each(  $(this).parent().parent().find('.modal_update'), function(e,v){
            post_obj[$(v).attr('class').replace('modal_update', '').trim()] = $(v).val();
        });

        //FROM HERE WE SERIALIZE AND POST TO OUR API.
        console.log(post_obj);
    });
}

var bindMotiEdit = function(){
    $('body').on('click', '.moti_edit', function(){
        var edit_obj = {};
        $.each($('div.remodal-is-initialized').find('span.moti_selector'), function(e,v){
            var key_name = $(v).attr('class').replace('moti_selector','').trim();
            edit_obj[key_name] = ((['modal_receiveBy','modal_frequency']).indexOf(key_name) > -1) ? $(v).html().toLowerCase().replace(/ /g, '_') : $(v).html();
        });

        $.get('moti_update?prompt_id='+selected_batch_id, function(content){
            //calculate hours, minutes from our start time
            var start_time = (edit_obj.modal_startTime).split(':');
            //fetch our template, and populate it with the values from the motivational prompt:
            var wark = $('[data-remodal-id=display-motivational-edit]').clone();
            wark.html(content);
            wark.find('input.start_date').val(edit_obj.modal_startDate).datepicker({
            /*do stuff: like custom formatting and such.*/
            });

            wark.find('.moti_minute').val(start_time[1]);

            if (start_time[0] >= 12) {
                wark.find('.moti_hour').val(start_time[0]*1 -12);
                wark.find('.moti_tod').val('pm');
            }else {
                wark.find('.moti_hour').val(start_time[0]);
                wark.find('.moti_tod').val('am');
            }

            wark.find('.motivation_freq').val(edit_obj.modal_frequency);
            wark.find('.moti_delivery').val(edit_obj.modal_receiveBy);
            wark.find('.motivation_message_body').val(edit_obj.modal_message);
            wark.find('.user_email').val(edit_obj.modal_email);
            wark.find('.user_mobile').val(edit_obj.modal_phone);

            //remove extra input buttoneros.
            wark.find('.edit-button').hide();
            wark.find('#cancel').hide();

            wark.find('.update-button').one('click', function(){
                var payload       = {};
                payload.user_data = {};
                var form_data     = $('#motivationalModal').find('form').serializeArray();

               $(form_data).each(function(key, item){
                   payload.user_data[item['name']] = item['value'];
               });

               payload.user_data.prompt_id = selected_batch_id;

               $.ajax({
                   url: 'api/setMotiPrompt',
                   method: 'POST',
                   data: payload,
                   success: function(response){
                       wark.remodal()['close']();
                       location.reload();
                    }
                });

                wark.remodal()['close']();
            });

            wark.find('.cancel-button').one('click', function(){
                wark.remodal()['close']();
            });

            wark.remodal()['open']();
        });
    });
};

var bindMotivation = function(){
    $('body').on('click', '.motivation_button', function(e){
        e.stopPropagation();

        selected_batch_id = null;

        var message        = $(this).parent().parent().next().find('span.moti_message').html();

        var frequency      = $(this).parent().parent().next().find('.moti_frequency').html();
        var method         = $(this).parent().parent().next().find('.moti_receive').html();
        var start_date     = $(this).parent().parent().next().find('.moti_start_date').html();
        var start_time     = $(this).parent().parent().next().find('.moti_start_time').html();
        var toggle_button  = $(this).parent().parent().next().find('.moti_switch').html();
        var mobile_number  = $(this).parent().parent().next().find('.moti_phone_number').html();
        var email_addr     = $(this).parent().parent().next().find('.moti_email_addr').html();

        $('span.modal_message').html(message)
        $('span.modal_frequency').html(frequency)
        $('span.modal_receiveBy').html(method)
        $('span.modal_startDate').html(start_date)
        $('span.modal_startTime').html(start_time)
        $('span.modal_email').html(email_addr)
        $('span.modal_phone').html(mobile_number)


        var hidden = $(this).parents('td').next(); // .find('.moti_switch')

        //this var exists outside the scope of this method, since we'll need to use it for the edit functionality.

        selected_batch_id =  hidden.find('.moti_prompt').html();

        $('span.modal_toggle_button').html(toggle_button)
            .attr('data-batch_id', selected_batch_id);

        // if (hidden.find('.moti_switch').hasClass('moti_enable')) {
        //     $('span.modal_toggle_button').html(toggle_button).attr('data-mode', 1);
        // } else {
        //    $('span.modal_toggle_button').html(toggle_button).attr('data-mode', 0);
        // }

        $('span.modal_toggle_button').html(toggle_button).attr('data-mode', hidden.find('.moti_switch').hasClass('moti_enable') ? 1 : 0);


        $('[data-remodal-id=display-motivational-msg]').remodal()['open']();
     });
};

var bindAPActionClick = function(){
    $(".btnPrint").printPage();
}


var bindSurveyResume = function() {
    $('.survey_resume').click(function(e){
        e.preventDefault();
        var batch_id    = $(this).attr("data-batch_id");
        var page_number = $(this).attr("data-page_number");

        localStorage.setItem('survey_id', batch_id);
        localStorage.setItem('page_number', page_number);
        localStorage.setItem('resume_survey', true);
        window.location    = '/healthsurvey';
    });
}

var bindMotiToggle = function() {
    $('.moti_switch').click(function(){
        var batch_id = $(this).attr('data-batch_id');
        var mode     = $(this).attr('data-mode');

        if (typeof batch_id == 'undefined' || typeof mode == 'undefined') {
            console.log('missing data');
            return;
        }
        $.ajax('api/startStopPrompt', {
            data : {'batch_id': batch_id , 'mode' : mode},
            type : 'POST'
        }).done(function(data){
            if (mode == 1) {
                $('.modal_toggle_button').attr('data-mode',0);
                $('.modal_toggle_button').html('Disable Prompt');
                $('.modal_toggle_button').removeClass('moti_enable')
                $('.modal_toggle_button').addClass('moti_disable')
            } else {
                $('.modal_toggle_button').attr('data-mode',1)
                $('.modal_toggle_button').html('Enable Prompt');
                $('.modal_toggle_button').removeClass('moti_disable')
                $('.modal_toggle_button').addClass('moti_enable')
            }
        });
    });
}

var bindMotiShower = function() {
    $('.moti_shower').click(function(e){
        e.preventDefault();
        if ($(this).hasClass('more')) {
            $(this).addClass('less');
            $(this).removeClass('more');
            $(this).html('Show Less...');
            $(this).prevAll('span.moti_full').removeClass('hidden_obj');
            $(this).prevAll('span.moti_preview').addClass('hidden_obj');
        } else {
            $(this).addClass('more');
            $(this).removeClass('less');
            $(this).html('Show More...');
            $(this).prevAll('span.moti_full').addClass('hidden_obj');
            $(this).prevAll('span.moti_preview').removeClass('hidden_obj');
        }
    });
}

