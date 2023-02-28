var Users = {
    followup_data:  {},
    current_followup: null,

    init: function(){
        $('#edit-user').click(function(){
            Users.edit();
        });
        $('#cancel-user').click(function(){
            Users.cancelEdit();
        });

        $('.login-user').click(function(){
            Users.loginAs(this);
        })

        $('#upload-button').click(function(event){
            event.preventDefault();
            Users.upload();
        })


        $('.followup-action, #create-followup').click(function(e){
            Users.resetInputs();
        });

        // $('#saveNewFollowup').click(function(e){
        //     e.preventDefault();
        //     Users.createnewFollowup();
        // });

        $('#save').click(function(){
            Users.submitForm();
            console.log('here')
            return false;
        })
        $('#cancel').click(function(){
            $("#whole-form").popup('hide');
        })

        $("#import-users").click(function(){
            console.log('Importing users');
            //$("#importer").popup('show');
        });

        $("[name=user_role]").on('change', function(){
            Users.showUserForm($(this).val());
        })

        $('#search-box').on('keyup', function(){
            Users.filter($(this).val());
        });

        $('.edit-user').click(function(){
            console.log('clicked');
            Users.editUser(this);
        });

        $('#search-box').on('keyup', function(){
            console.log($(this).val())
        })

        $('body').on('click', '.report-trigger', function(){
            $('.dropdown').hide();
            $(this).next('ul').show().find('a:first-child').click(function(e){
                e.preventDefault();
                $('.dropdown').hide();
                Users.ajaxUrl($(this));
            });
         })



        // $('#myModal').on('shown.bs.modal', function () {
        //     Users.resetUserForm();
        // });

        $( function(){
            $("#date_of_birth").datepicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-110:c"
            });
            $('#followup_date').datepicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-110:c"
            });
            $('#new-followup-date').datepicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-110:c"
            });

           $('.survey_date').datepicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-110:c"
            });

           $('.fu-edit-date').datepicker({
              changeMonth: true,
              changeYear: true,
              yearRange: "c-110:c"
            });
        });

        // $('#saveFollowupAction').click(function(e){
        //     e.preventDefault();
        // })

        // $('.followup-action').click(function(e){
        //     Users.current_followup =  $(this).data().followup_id;
        //     $.post('../../../api/fetchFollowup', {followup_id: Users.current_followup, patient_id: $('input[name="user_id"]').val()   }, function(data){
        //     }).done(function(data) {
        //         var json_data = JSON.parse(data).payload;

        //         console.log(json_data);

        //             //populate the form values:
        //             $('span.action_plan_id').text(json_data.action_plan_id);
        //             $('.fu-edit-date').val(json_data.followup_date);
        //             $('.fu-edit-minute').val(json_data.followup_minute);
        //             $('.fu-edit-reminder').val(json_data.prompt_type);
        //             $('.fu-edit-method').val(json_data.followup_method);
        //             $('.fu-edit-regarding').val(json_data.regarding);
        //             $('.fu-edit-coach option[value="' + json_data.followup_participant + '"]').prop('selected', true);
        //             $('.fu-edit-outcome').val(json_data.outcome);
        //             $('.fu-edit-nextstep').val(json_data.next_step);
        //             $('.fu-edit-notes').val(json_data.notes);
        //             $('.fu-edit-hour').val( (json_data.followup_hour > 12)? json_data.followup_hour - 12 : json_data.followup_hour);
        //             $('.fu-edit-meridian').val((json_data.followup_hour >= 12) ? 'PM' : 'AM');

        //     });
        //     return;
        // });

        // $('#updateFollowupAction').click(function(e){
        //     e.preventDefault();
        //     Users.updateExistingFollowup();
        // });

        $('#update-user').click(function(){
            Users.submitForm();
            return false;
        })

        $('#schedule_survey_submit').click(function(e){
            e.preventDefault();

            var user_input = {};

            var hour   = $('.survey_hour').val();
            var minute = $('.survey_minute').val();
            var date   = $('.survey_date').val();
            var meridian = $('.survey_meridian').val();
            var patient_id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
            var remind_method = $('.survey_remind_method').val();

            if (hour.length > 0 && minute.length > 0 && date.length > 0 && patient_id.length > 0 && remind_method.length > 0 && meridian.length > 0) {
                user_input['hour'] = hour;
                user_input['minute'] = minute;
                user_input['date']   = date;
                user_input['meridian'] = meridian;
                user_input['patient_id'] = patient_id;
                user_input['remind_method'] = remind_method;

                $.ajax({
                    url: '/api/scheduleSurvey',
                    method: 'POST',
                    data: user_input,
                    success: function(response){
                        var json = JSON.parse(response);

                        if (json.status == true) {
                            alert("Survey Scheduled");
                            $('.modal.in').modal('hide');
                        } else {
                            console.log('no survey added');
                        }
                    },
                });
            }
            return;
        });

        $('.delete_coach').click(function(){
            console.log('Deleting coach')
            Users.deleteCoach($(this).data('user_id'), $(this).data('coach_id'), $(this).data('type'));
        })
        $('.delete_provider').click(function(){
            console.log('Deleting provider')
            Users.deleteCoach($(this).data('user_id'), $(this).data('coach_id'), $(this).data('type'));
        })
    },

    clearFormErrors: function(){
        $('.form-error').remove();
    },

    // createnewFollowup: function(){
    //     this.clearFormErrors();

    //     var errors = false;
    //     if($('.newFollowupDate').val() == '') {
    //         errors = true;
    //         this.showError('new-followup-date', 'Please select a date');
    //     }
    //     if($('.newFollowupHour').val() == null) {
    //         errors = true;
    //         this.showError('new-followup-hour', 'Required');
    //     }
    //     if($('.newFollowupMinute').val() == null) {
    //         errors = true;
    //         this.showError('new-followup-minute', 'Required');
    //     }
    //     if($('.newFollowupMeridian').val() == null) {
    //         errors = true;
    //         this.showError('new-followup-meridian', 'Required');
    //     }

    //     if(errors){
    //         return false;
    //     }

    //     Users.followup_data = {};
    //     Users.followup_data.user_id         = $('input[name="user_id"]').val();
    //     Users.followup_data.date            = $('.newFollowupDate').val();
    //     Users.followup_data.hour            = $('.newFollowupHour').val()*1;
    //     Users.followup_data.minute          = $('.newFollowupMinute').val()*1;
    //     Users.followup_data.tod             = $('.newFollowupMeridian').val();
    //     Users.followup_data.reminder_method = $('.newFollowupReminderMethod').val()*1;
    //     Users.followup_data.followup_method = $('.newFollowupFollowUpMethod').val();
    //     Users.followup_data.coach           = $('.newFollowupCoach').val() || '0f6ffda3c9c9ce15f279b788b486e9ca';
    //     Users.followup_data.regarding       = $('.newFollowupRegarding').val();

    //     Users.postFollowup();
    //     location.reload();

    //     return;
    // },

    resetInputs: function(){
        Users.current_followup = null;
        $('.newFollowupDate').val('');
        $('.newFollowupHour').val('');
        $('.newFollowupMinute').val('');
        $('.newFollowupMeridian').val('');
        $('.newFollowupReminderMethod').val('');
        $('.newFollowupFollowUpMethod').val('');
        $('.newFollowupCoach').val('');
        $('.newFollowupRegarding').val('');

        $('span.action_plan_id').text('');
        $('.fu-edit-date').val('');
        $('.fu-edit-hour').val('');
        $('.fu-edit-minute').val('');
        $('.fu-edit-meridian').val('');
        $('.fu-edit-reminder').val('');
        $('.fu-edit-method').val('');
        $('.fu-edit-coach').val('');
        $('.fu-edit-regarding').val('');
        $('.fu-edit-outcome').val('');
        $('.fu-edit-nextstep').val('');
        $('.fu-edit-notes').val('');
    },

    // updateExistingFollowup: function(){
    //     Users.followup_data = {};
    //     Users.followup_data.user_id         = $('input[name="user_id"]').val();
    //     Users.followup_data.followup_id     = Users.current_followup

    //     if (typeof $('span.action_plan_id').text() != 'undefined') {
    //         Users.followup_data.action_plan_id  = $('span.action_plan_id').text()*1;
    //     }
    //     Users.followup_data.date            = $('.fu-edit-date').val();
    //     Users.followup_data.hour            = $('.fu-edit-hour').val()*1;
    //     Users.followup_data.minute          = $('.fu-edit-minute').val()*1;
    //     Users.followup_data.tod             = $('.fu-edit-meridian').val();
    //     Users.followup_data.reminder_method = $('.fu-edit-reminder').val()*1;
    //     Users.followup_data.followup_method = $('.fu-edit-method').val();
    //     Users.followup_data.coach           = $('.fu-edit-coach').val();
    //     Users.followup_data.regarding       = $('.fu-edit-regarding').val();
    //     Users.followup_data.outcome         = $('.fu-edit-outcome').val();
    //     Users.followup_data.nextstep        = $('.fu-edit-nextstep').val();
    //     Users.followup_data.notes           = $('.fu-edit-notes').val();

    //     if (Users.followup_data != '' && Users.followup_data.method != '' && Users.followup_data.tod != '' && Users.followup_data.hour != '' && Users.followup_data.minute != '' && Users.followup_data.user_id !='') {
    //         Users.postFollowup();
    //         //location.reload();

    //     } else {
    //         console.log('We could not save that followup.');
    //     }
    //     return;
    // },

    // postFollowup: function() {
    //     $.post('../../../api/schedulefollowup', Users.followup_data, function(data){}).done(function(){
    //         $('.modal.in').modal('hide');
    //         return true;
    //     });
    // },

    ajaxUrl: function(link){
        console.log(link);

        window.location = link.attr('href');
        $.ajax({
            url: link.attr('href'),
            method: 'GET',
            dataType: 'html',
            success: function(response){
                //console.log(response);
                //$('#pageModal').find('.modal-body').html('sdshdifuashdifuahsdifuagsdifuagsdf');
                $('#pageModal').modal()
            }
        })
    },

    cancelEdit: function(){
        $('#user-form').find('input, select').prop('disabled', true);
        $('#edit-user').show();
        $('#cancel-user').hide();
        $('#update-user').hide();
        $('#coaches-select').hide();
        $('#practice-select').hide();
        $('#password-holder').hide();
        $('#confirm-password-holder').hide();
        $('#confirm-email-holder').css('visibility', 'hidden');
    },

    edit: function(){
        $('#user-form').find('input, select').prop('disabled', false);
        $('#edit-user').hide();
        $('#cancel-user').show();
        $('#update-user').show();
        $('#coaches-select').show();
        $('#practice-select').show();
        $('#password-holder').show();
        $('#confirm-password-holder').show();
        $('#confirm-email-holder').css('visibility', 'visible');
        $('.form-error').remove()
    },

    loginAs: function(button){
        $.ajax({
            url: '/admin/users/login-as/' + $(button).data('user_id'),
            method: 'GET',
            success: function(response){
                console.log(response);
                if($(button).data('redirect-url')){
                    window.location = $(button).data('redirect-url');
                } else {
                    window.location = '/dashboard';
                }
            }
        })
    },

    filter: function(txt){
        console.log('Searching for: ' + txt);

        $('td').each(function(){

        })
    },

    showUserForm: function(userType){
        $(".form-error").remove();
        console.log(userType);
        if(userType == 'translator' || userType == 'cth administrator' || userType == 'cth groupleader'){
            $('#practice').hide();
        } else {
            $('#practice').show();
        }
    },

    resetFields: function(){

    },


    validateForm: function(form){
        // check required
        var valid = true;
        $('.required').each(function(){
            $(this).css('border-color', '#aaa')
            $("label[for='"+$(this).attr('id')+"']").css('color', '#000');
            if($(this).is(':visible') && $(this).val() == '') {
                $(this).css('border-color', '#f00');
                $("label[for='"+$(this).attr('id')+"']").css('color', '#f00');
                console.log($(this).attr('name') + ' is required');
                valid = false;
            }
        })

        return valid;
    },

    clearErrors: function(){
        $('.required').each(function(){
            $(this).css('border-color', '#aaa')
            $("label[for='"+$(this).attr('id')+"']").css('color', '#000');
        })
    },

    showError: function(name, error){
        var holder = $('#'+name).parent();
        $(holder).append('<div class="form-error">'+error+"</div>");
    },

    submitForm: function(){
        console.log('saving user');
        $.ajax({
            url: '/api/user',
            method: 'POST',
            data: $("#user-details").serialize(),
            success: function(response){
                $(".form-error").remove();
                console.log(response);
                if(!response.success){
                    $.each(response.errors, function(field, errors){
                        $.each(errors, function(id, error){
                            Users.showError(field, error);
                        });
                    })
                } else {
                    // close popup
                    $("#whole-form").popup('hide');
                    location.reload();
                }
            }
        });
    },

    editUser: function(button){
        this.getUser($(button).data('user-id'));
    },

    loadUserData: function(user){
        //$("#whole-form").popup('show');
        Users.showUserForm(user.role_name);

        $('#user-details #user_id').remove();
        $('#user_role').val(user.role_name.toLowerCase());
        $('#time_zone').val(user.time_zone_id);
        $('#user-details').prepend('<input type="hidden" name="user_id" id="user_id" value="'+user.user_id+'" />');

        $.each(user, function(index, item){
            $('#'+index).val(item);
        });
    },

    getUser: function(userId){
        $.ajax({
            url: '/admin/users/edit/'+userId,
            method: 'GET',
            success: function(response){
                $('.modal-body').html(response);
                
                $('#save').click(function(){
                    Users.submitForm();
                    console.log('here')
                    return false;
                })      
            }
        });
    },

    upload: function(){
        console.log("Uploading Patients");
        var fd = new FormData(document.getElementById("upload-form"));
        fd.append("label", "WEBUPLOAD");
        $.ajax({
            url: "/admin/users/patients/import",
            type: "POST",
            dataType: 'json',
            data: fd,
            processData: false,  // tell jQuery not to process the data
            contentType: false   // tell jQuery not to set contentType
        }).done(function( response ) {
            console.log( response );

            if(response.noFile){
                $('#upload-response').html('You must select a file to upload').addClass('error')
            }else if(response.noErrors){
                //location.reload();
                $('#upload-response').html('Upload completed successfully without errors').addClass('success')
            } else {
                $('#upload-response').html('Upload completed but some rows had errors.  Click <a href="' + response.logFile + '" target="_blank">here</a> to view report').addClass('error')
            }
        });
        return false;
    },

}

$(document).ready(function(){
    Users.init();
})
