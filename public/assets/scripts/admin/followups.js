var Followups = {
    init: function(){
        $('.followup-action').click(function(e){
            Followups.edit(this)
            $('.followup-update-items').show();
        });

        $('#create-followup').click(function(){
            Logging.log('Create new followup');
            $('#followup-form [name=user_id]').val($(this).data('user_id'));
            $('.followup-update-items').hide();
        })

        $('.fu-edit-date').datepicker({
          changeMonth: true,
          changeYear: true,
          yearRange: "c-110:c"
        });

        $('#updateFollowupAction').click(function(e){
            e.preventDefault();
            Followups.save();
        });
    },

    save: function(){
        Logging.log('saving');
        var values = $('#followup-form').serialize();
        //values.followup_date = $('#followup-form [name=followup_date]').val();
        Logging.log(values);
        $.ajax({
            url: '../../../api/schedulefollowup',
            data: $('#followup-form').serialize(),
            method: 'POST',
            success: function(result){
                Logging.log(result);
                location.reload();
            }
        })
        // $.post('../../../api/schedulefollowup', $('#followup-form').serialize(), function(data){}).done(function(){
        //     $('.modal.in').modal('hide');

        //     //location.reload();
        // });
    },

    load: function(followupId, patientId, copyOnly){
        Logging.log('loading');
        $.post('../../../api/fetchFollowup', {followup_id: followupId, patient_id: patientId }, function(data){

        }).done(function(data) {
            var json_data = JSON.parse(data).payload;

            Logging.log('parsing response');

            if(copyOnly){
                Logging.log('data');
                Followups.loadData(json_data);

            } else {
                Logging.log('form');
                Followups.loadForm(json_data);
            }
        });

    },

    loadForm: function(json_data){
        //Logging.log(json_data);
        if(json_data.followup_hour > 12){
            json_data.hour = json_data.followup_hour - 12;
            json_data.meridian = 'PM';
        } else {
            json_data.hour = json_data.followup_hour;
            json_data.meridian = 'AM';
        }
        json_data.minute = json_data.followup_minute;
        json_data.nextstep = json_data.next_step;
        json_data.coach = json_data.followup_participant;
        //Logging.log(json_data);

        for(var key in json_data){
            Logging.log(key+': '+json_data[key]);
            $('#followup-form [name='+key+']').val(json_data[key]);
        }

        var tmpDate = new Date(json_data.followup_date);
        var d  = new Date( tmpDate.getTime() + Math.abs(tmpDate.getTimezoneOffset()*60000));
        $('#followup-form .fu-edit-date').datepicker("setDate", d);
    },

    loadData: function(json_data){
        Logging.log(json_data);
        var tod = 'am';
        $('#followUpCopy .patient_name').html(json_data.patient_name);
        $('#followUpCopy .patient_identifier').html(json_data.patient_identifier);
        $('#followUpCopy .followup_date').html(json_data.followup_date);
        if(json_data.followup_hour > 12){
            json_data.followup_hour -= 12;
            tod = 'pm';
        }
        $('#followUpCopy .followup_time').html(json_data.followup_hour + ':' + json_data.followup_minute + ' ' + tod);
        $('#followUpCopy .regarding').html(json_data.regarding);
        $('#followUpCopy .provider_name').html(json_data.provider_name);
        $('#followUpCopy .followup_method').html(json_data.followup_method);
        $('#followUpCopy .notes').html(json_data.notes);
        $('#followUpCopy .reminder_method').html(json_data.reminder_method);
        $('#followUpCopy .outcome').html(json_data.outcome_text);
        $('#followUpCopy .next_step').html(json_data.step_text);
        // $('#followUpCopy .').html(json_data.);
    },

    create: function(){

    },

    edit: function(button){
        if(followupId = $(button).data('followup_id')){
            if($(button).data('copy')){
                Followups.load(followupId, $(button).data('patient_id'), true);
            } else {
                Followups.load(followupId, $(button).data('patient_id'), false);
            }
        }
    }
}


$(document).ready(function(){
    Followups.init();
    $('#follow-ups').addClass('active');
})