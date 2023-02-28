var user_id        =  $("meta[name='user_id']").attr('content');
var action_plan_id = $("meta[name='action_plan_id']").attr('content');
$(document).ready(function(){
    var fu = new Date();
    var start_date = new Date( fu.getTime() + Math.abs(fu.getTimezoneOffset()*60000));

    action_plan              = {};
    action_plan.batch_id     = null;
    action_plan.survey_id    = null;
    action_plan.current_step = '';

    action_plan.steps = {
        1 : null,
        2 : null,
        3 : null,
        4 : null,
        5 : null,
        6 : null,
        7 : null,
        8 : null,
        9 : null
    };

    action_plan.user_input = {
        'my_goal'            : '',
        'brain_storm_opt_1'  : '',
        'brain_storm_opt_2'  : '',
        'brain_storm_opt_3'  : '',
        'brain_storm'        : '',
        'plan_text'          : '',
        'barrier_text'       : '',
        'strategy_text'      : '',
        'track_else'         : '',
        'track_paper'        : 0,
        'track_calendar'     : 0,
        'track_app'          : 0,
        'confidence_level'   : 0,
        'coached'            : '',
        'start_date'         : ('0' + (start_date.getMonth() + 1)).slice(-2) + '/' + ('0' + start_date.getDate()).slice(-2) + '/' +  start_date.getFullYear()
    };

    $('button.ap_flow').click(function(e){
        e.stopPropagation();
        if ($(this).hasClass('new_ap')){
            $('.ap_fill_method').removeClass('hidden_obj');
            $('.existing_action_plan_select').addClass('hidden_obj');
            bind_coach_inputs();
        } else {
            $('.existing_action_plan_select').removeClass('hidden_obj');
            $('div.ap_fill_method').addClass('hidden_obj');
            bind_ap_select();
        }
    });

    var bind_coach_inputs = function() {
        $('body').on('change', 'input[name="coach_select"]', function(){
            action_plan.user_input.coached = $(this).val();
        });

        $('body').on('click', 'button.save_coach', function(){
            if (action_plan.user_input.coached != '') {
                finalize_new_ap();
            }
        });
    };

    var finalize_new_ap = function() {
        $.post('api/newactionplan', {'user_id': user_id, 'coached': action_plan.user_input.coached}, function(data) {
            try {
                var json             = JSON.parse(data);
                action_plan.batch_id = json.batch_id;

                action_plan.current_step = 1;

                $('.ap_workflow_select').addClass('hidden_obj');
                $('.ap_list_layout').removeClass('hidden_obj');
                $('.content_container').removeClass('hidden_obj');
                $('.ap_container').removeClass('hidden_obj');
                $('#action-plan-intro').addClass('hidden_obj');

                load_goals();
                validate_step();
                display_slide();

            } catch(e){
                console.log('somethings wrong boss!');
            }
        });
    }

    //user controls START
    $('button.ap_movement').click(function(){
        var direction = ($(this).hasClass('ap_back'))? 'back' : 'forward';

        if (!validate_answers(action_plan.current_step) && direction == 'forward')  {

            console.log('need to fill out form, figure out less intrusive way to notify.');
            return;
        }

        $.post('api/updateactionplan', {'user_input': action_plan.user_input, 'batch_id' : action_plan.batch_id })
            .done(function(data){
                console.log(data);
                if (action_plan.batch_id != data) {
                action_plan.batch_id = data;
                action_plan.current_step = 1;
                } else {
                    if (direction === 'forward') {
                        action_plan.steps[action_plan.current_step] = true;
                        action_plan.current_step++;
                    } else if(direction ==='back') {
                        action_plan.current_step--;
                    }
                }
                validate_step();
                display_slide();
            })
            .fail(function(xhr, status, error){
                console.log(xhr);
                console.log(status);
                console.log(error);
            });
    });

    $('.ap_list_item').click(function(){
        var new_step  = $(this).attr('ap_step')*1;
        var curr_step = action_plan.current_step*1;
        var i = new_step -1;
        for (i; i > 0; i--) {
            if (action_plan.steps[i] === null) {
                return;
            }
        }
        //if we get here, we're good!
        action_plan.current_step = $(this).attr('ap_step');
        validate_step();
        display_slide();
    });

    $('body').on('click', '.ap_start_date', function(){
        var date_base = new Date();
        var max_date = date_base.setMonth( date_base.getMonth() +1);
        var min_date = date_base;

        $(this).datepicker({
            endDate: max_date,
            startDate:  new Date(),
            format: {
                toDisplay: function (date, format, language) {
                    var fu = new Date(date);
                    var d  = new Date( fu.getTime() + Math.abs(fu.getTimezoneOffset()*60000));
                    return  ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' +  d.getFullYear();
                },
                toValue: function (date, format, language) {
                    var d = new Date(date);
                    return new Date(d);
                }
            }
        });
        $(this).datepicker('show');
    });

   $('body').on('click', '.followup_date', function(){
       var date_base = new Date();
       var max_date = date_base.setMonth( date_base.getMonth() +1);
       var min_date = date_base;

       $(this).datepicker({
           endDate: max_date,
           startDate:  new Date(),
            format: {
                toDisplay: function (date, format, language) {
                    var fu = new Date(date);
                    var d  = new Date( fu.getTime() + Math.abs(fu.getTimezoneOffset()*60000));
                    return  ('0' + (d.getMonth() + 1)).slice(-2) + '/' + ('0' + d.getDate()).slice(-2) + '/' +  d.getFullYear();
                },
                toValue: function (date, format, language) {
                    var d = new Date(date);
                    return new Date(d);
                }
            }
        });
       $(this).datepicker('show');
   });

   $('body').on('click', '.set_followup', function(){
       manage_modal('action-plan-followup', 'open');
   });

   $('body').on('click', '.followup_save', function(){
       var input = {};
       //initialize our values..
       input.action_plan_id = action_plan.batch_id;
       input.coach           = '';
       input.method          = '';
       input.tod             = '';
       input.hour            = '';
       input.minute          = '';

       input.coach           = $('select.followup_coach_selection').val();
       input.followup_method = $('select.followup_method_selection').val();
       input.tod             = $('select.followup_tod').val();
       input.hour            = $('select.followup_hour').val();
       input.minute          = $('select.followup_minute').val();
       input.date            = $('input.followup_date').val();
       input.reminder_method = $('select.followup_prompt_type').val();
       input.regarding       = $('input.followup_regarding').val();

       var email_address = $('.followup_pref_email').val();
       var mobile_num    = $('.followup_pref_phone').val();
       var reminder_type = $('.followup_prompt_type').val()*1;

       if (reminder_type == 1) {
           if (validate_phone(mobile_num)) {
               input.mobile_number = mobile_num;
           } else {
               console.log('mobile needs to be properly set');
           }
       } else if(reminder_type == 2) {
           if (validate_email(email_address)) {
               input.email_address = email_address;
           } else {
             console.log('email needs to be properly set');
           }
       } else if (reminder_type == 3) {
           if (validate_phone(mobile_num) && validate_email(email_address)) {
               input.email_address = email_address;
               input.mobile_number = mobile_num;
           } else {
               console.log('both need to be set properly');
           }
       }

       if (input.coach != '' && input.followup_method != '' && input.tod != '' && input.hour != '' && input.minute != '') {
           $.post('api/schedulefollowup', input, function(data){
               if (isNaN(JSON.parse(data).success)){
                   alert('Issue Saving Follow Up...');
               }
            }).done(function() { alert('follow up has been saved!'); manage_modal('action-plan-followup', 'close');  });
       } else {
           alert('Fields missing.');
       }
   });

   $('body').on('click', '.followup_clear', function(){
       $('.fu_input').each(function(){
           $(this).val('');
       });
   });

   $('body').on('click', '.moti_clear', function(){
       $('.moti_input').each(function(){
            $(this).val('');
        });
   });

   $('body').on('change', '.followup_prompt_type', function(){
       var selected_value = $(this).val();
       if (selected_value === '1') {
           $('.fu_phone_input').removeClass('hidden_obj');
           $('.fu_email_input').addClass('hidden_obj');
       } else if(selected_value === '2') {
           $('.fu_email_input').removeClass('hidden_obj');
           $('.fu_phone_input').addClass('hidden_obj');
       } else if (selected_value === '3') {
           $('.fu_email_input').removeClass('hidden_obj');
           $('.fu_phone_input').removeClass('hidden_obj');
       } else {
           $('.fu_email_input').addClass('hidden_obj');
           $('.fu_phone_input').addClass('hidden_obj');
       }
   });

   //loading up a preselected AP:
   if (action_plan_id.length > 0) {
            $('div.content_container').empty();
        //set the new action_plan id:
        action_plan.batch_id = action_plan_id;
        $.post('api/fetchactionplan', {action_plan_id: action_plan.batch_id}, function(data){
            action_plan.user_input = JSON.parse(data).data;
            parse_user_input();
            validate_step();
            $('div.ap_workflow_select').addClass('hidden_obj');
            $('div.ap_list_layout').removeClass('hidden_obj');
            $('div.content_container').removeClass('hidden_obj');
            $('div.ap_container').removeClass('hidden_obj');

            // Close the modal window:
            //manage_modal('action-plan-start', 'close');
            $('#action-plan-intro').addClass('hidden_obj');

        }).done(function() {
            load_goals();
            display_slide();
            populate_tabs();
        });
   }
});

//can update this method later to use real validation, when we're not so crunched for time.
var validate_phone = function(phone_number){
    return (phone_number.length >= 10);
};

var validate_email = function(email){
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

//user controls END
var bind_ap_select = function(){
    $('body').on('change','.existing_action_plan_select', function(e){
        $('div.content_container').empty();
        //set the new action_plan id:
        action_plan.batch_id = $(this).val();
        $.post('api/fetchactionplan', {action_plan_id: action_plan.batch_id}, function(data){
            action_plan.user_input = JSON.parse(data).data;
            parse_user_input();
            validate_step();
            $('div.ap_workflow_select').addClass('hidden_obj');
            $('div.ap_list_layout').removeClass('hidden_obj');
            $('div.content_container').removeClass('hidden_obj');
            $('div.ap_container').removeClass('hidden_obj');

            // Close the modal window:
            //manage_modal('action-plan-start', 'close');
            $('#action-plan-intro').addClass('hidden_obj');

        }).done(function() {
            load_goals();
            display_slide();
            populate_tabs();
        });
    });
};

var manage_modal = function(id_string, action) {
    var $modal = $('[data-remodal-id="' + id_string + '"]');
    // Open by default:
    action = (action || 'open');
    if ($modal.length) {
        $modal.remodal()[action]();
    }
}

var validate_step = function() {
    if (action_plan.current_step*1 === 1) {
        $('button.ap_back').addClass('pure-button-disabled');
    } else {
        $('button.ap_back').removeClass('pure-button-disabled');
    }
    if (action_plan.current_step*1 >= 9) {
        $('button.ap_forward').addClass('pure-button-disabled');
    } else {
        $('button.ap_forward').removeClass('pure-button-disabled');
    }

    $('li.ap_list_item').each(function(e,v){
        var ap_index = e + 1;
        $('li[ap_step="'+ap_index+'"]').removeClass('ap_step_current tabber-active');
        $('li[ap_step="'+ap_index+'"]').removeClass('ap_step_todo');
        $('li[ap_step="'+ap_index+'"]').removeClass('ap_step_completed tabber-completed');

        if (action_plan.steps[ap_index] === true) {
            $('li[ap_step="'+ap_index+'"]').addClass('ap_step_completed tabber-completed');
        }else {
            $('li[ap_step="'+ap_index+'"]').addClass('ap_step_todo');
        }
        if ( ap_index == action_plan.current_step) {
            $('li[ap_step="'+ap_index+'"]').removeClass('ap_step_completed tabber-completed');
            $('li[ap_step="'+action_plan.current_step+'"]').addClass('ap_step_current tabber-active');
        }
    });
};

var load_goals = function() {
    $('div.content_container').html('');
    var goal_slide = $('div.ap_1').clone();
    var muta = goal_slide.find('div#ap_mutable').eq(0);
    muta.empty();

    if (action_plan.survey_id === null || action_plan.survey_id === '') {
        action_plan.survey_id = ( ~~ $('#action-plan').data('survey-id'));
    }

    $.getJSON(('api/fetchsurveyDetail?ap_id=' + action_plan.batch_id), function(data) {
        var ap_grid_template = $('div.ap_grid_template');
        var entry;
        var ap_clone;
        var i;
        var l;
        var take_survey = true;
        // Quick and dirty:
        muta.addClass('boxers-wrap');
        muta.wrap('<div class="boxers" />');
        for (i = 0; i < data.length; i++) {
            entry = data[i];
            if (entry.goal_id*1 == action_plan.user_input.my_goal*1) {
                $('li.ap_list_item[ap_step="1"]').find('p.line_desc_2').html(entry.friendly_name);
            }
            ap_clone = ap_grid_template.clone();
            ap_clone.attr('data-eval_id', entry.goal_id);
            ap_clone.removeClass('ap_grid_template');
            ap_clone.removeClass('hidden_obj');
            ap_clone.addClass('ap_goal_item boxers-box');
            $('<p/>').addClass('text_result').html(entry.friendly_name).appendTo(ap_clone);
            switch(entry.eval_result) {
                case 'red':
                    ap_clone.addClass('border-red color-red');
                    take_survey = false;
                    break;
                case 'yellow':
                    ap_clone.addClass('border-orange color-orange');
                    take_survey = false;
                    break;
                case 'grey':
                    ap_clone.addClass('border-gray color-gray');
                    break;
                default:
                    // Nothing.
               }
               muta.append(ap_clone);
            }

            if ($('a.lang_url').hasClass('spanish')) { //we're in english.
                muta.append($('<div class="ap_goal_item boxers-box freeform" />').html('<p class="freeform">Create a New Goal</p>'));
            } else {
                muta.append($('<div class="ap_goal_item boxers-box freeform" />').html('<p class="freeform">Crear un nuevo objetivo</p>'));
            }

            bind_freeform();
            goal_slide.removeClass('hidden_obj');
            muta.show();
            if (take_survey == true) {
                $(goal_slide).find('.take_survey').eq(0).removeClass('hidden_obj');
            }
            if (action_plan.current_step*1 == 1) {
                $('div.content_container').html(goal_slide);
            }
    }).done(function(){
        $('footer.shifter.ap_container').removeClass('hidden_obj');
    });
};

var display_slide = function(){
    $('div.content_container').html('');
    switch(action_plan.current_step*1)
    {
        case 1:
            load_goals();
        break;

        case 2:
            bind_brainstorm();
            populate_brainstorming_inputs();
            bind_health_tip_modal();
        break;
        case 3:
            populate_brainstorming();
            brain_storm_selection();
        break;

        case 4:
            populate_plan_text();
            bind_plan_text();
        break;

        case 5:
            populate_barrier_text();
            bind_barrier_text();
        break;

        case 6:
            populate_strategy_text();
            bind_strategy_text();
        break;

        case 7:
            populate_track_values();
            bind_track_text();
        break;

        case 8:
            populate_confidence();
            bind_confidence_selection();
        break;
        case 9:
            populate_next_steps();
            bind_moti_selectors();
        break;
        default:
            console.log(action_plan.current_step)
        break;
    }

    //we're good to load our content into the display div:
    var div_to_load = $('div.ap_'+ action_plan.current_step).clone().removeClass('hidden_obj');
    $('div.content_container').html(div_to_load);
};

//goal selection:
$('body').on('click','.ap_goal_item', function(e){
    $('.ap_goal_item').each(function(){
        $(this).removeClass('ap_goal_item_selected borders-box-selected');
    });

    $(this).addClass('ap_goal_item_selected borders-box-selected');
    action_plan.user_input.my_goal = $(this).attr('data-eval_id');
    action_plan.user_input.goal_text = $(this).find('p').eq(0).html();
    $('li.ap_list_item[ap_step="1"]').find('p.line_desc_2').html($(this).find('p').eq(0).html());
});

var bind_brainstorm = function() {
    $('body').on('keyup','span.brain_storm_input', function(e){
        var input_number =  $(this).data('input_number');
        switch (input_number)
        {
            case 1:
                action_plan.user_input.brain_storm_opt_1 = $(this).find('input').eq(0).val();
            break;

            case 2:
                action_plan.user_input.brain_storm_opt_2 = $(this).find('input').eq(0).val();
            break;
            case 3:
                action_plan.user_input.brain_storm_opt_3 = $(this).find('input').eq(0).val();
            break;
            default:
            break;
        }
    });
};

var populate_brainstorming = function(){
    $('#ap_3-target').empty();

    var input_container = {};
    input_container[0] = action_plan.user_input.brain_storm_opt_1;
    input_container[1] = action_plan.user_input.brain_storm_opt_2;
    input_container[2] = action_plan.user_input.brain_storm_opt_3;


    $.each (input_container, function(e,v) {
        if (v.length > 0 ) {
            $('<div />').addClass('brain_storm_option unselected checker').html(v).attr('data-brainstorm_input',(e+1)).appendTo('#ap_3-target');
        }
    });

    if (action_plan.user_input.brain_storm != null && action_plan.user_input.brain_storm.length > 0) {
        var selected = $('.brain_storm_option:contains("'+action_plan.user_input.brain_storm+'")')[0];
        $(selected).addClass('brain_storm_option_selected checker-checked');

        $('li.ap_list_item[ap_step="3"]').find('p.line_desc_2').html($(selected).text());
    }
};

var brain_storm_selection = function(){
    $('body').on('click','div.brain_storm_option', function(e){

        //remove prev classes.
        $('div.brain_storm_option').each(function(){
            $(this).removeClass('brain_storm_option_selected checker-checked');
        });

        //add new class.
        $(this).addClass('brain_storm_option_selected checker-checked');
        action_plan.user_input.brain_storm = $(this).html();
        $('li.ap_list_item[ap_step="3"]').find('p.line_desc_2').html(action_plan.user_input.brain_storm);
    });
};

var populate_brainstorming_inputs = function() {
    $('span.brain_storm_input').eq(0).find('input').val(action_plan.user_input.brain_storm_opt_1);
    $('span.brain_storm_input').eq(1).find('input').val(action_plan.user_input.brain_storm_opt_2);
    $('span.brain_storm_input').eq(2).find('input').val(action_plan.user_input.brain_storm_opt_3);
 }

var bind_plan_text = function(){
    $('body').on('keyup','textarea.plan_text', function(e){
        action_plan.user_input.plan_text = $(this).val();
        $('li.ap_list_item[ap_step="4"]').find('p.line_desc_2').html(action_plan.user_input.plan_text);
    });
};

var populate_plan_text = function(){
    $('textarea.plan_text').val(action_plan.user_input.plan_text);
};

var bind_barrier_text = function(){
    $('body').on('keyup','textarea.barrier_text', function(e){
        action_plan.user_input.barrier_text = $(this).val();
        $('li.ap_list_item[ap_step="5"]').find('p.line_desc_2').html(action_plan.user_input.barrier_text);
    });
};

var populate_barrier_text = function(){
    $('textarea.barrier_text').val(action_plan.user_input.barrier_text);
};

var bind_strategy_text = function(){
    $('body').on('keyup','textarea.strategy_text', function(e){
        action_plan.user_input.strategy_text = $(this).val();
        $('li.ap_list_item[ap_step="6"]').find('p.line_desc_2').html(action_plan.user_input.strategy_text);
    });
};

var populate_strategy_text = function(){
    $('textarea.strategy_text').val(action_plan.user_input.strategy_text);
};

var bind_track_text = function(){
    $('body').on('click','.track_text', function(e){
        check_tracking($(this));
    });

    $('body').on('keyup','.track_else_text', function(e){
        check_tracking($(this));
    });
};

var populate_track_values = function(){
    if (action_plan.user_input.track_else !== null) {
        if (action_plan.user_input.track_else.length > 0) {
            $('textarea.track_else_text').val(action_plan.user_input.track_else);
            $('input#track_4').prop('checked',true);
        }
    }
    if (action_plan.user_input.track_paper) {
        $('input#track_1').prop('checked',true);
    }
    if (action_plan.user_input.track_app) {
        $('input#track_2').prop('checked',true);
    }
    if (action_plan.user_input.track_calendar) {
        $('input#track_3').prop('checked',true);
    }
};

var check_tracking = function(obj){
    switch( obj.val())
    {
        case 'paper':
            action_plan.user_input.track_paper = (obj.prop('checked'))? 1: 0;
        break;

        case 'calendar':
            action_plan.user_input.track_calendar = (obj.prop('checked'))? 1: 0;
        break;

        case 'app':
            action_plan.user_input.track_app = (obj.prop('checked'))? 1: 0;
        break;

        case 'else':
            if ($('input#track_4').prop('checked')) {
                action_plan.user_input.track_else = ($('.track_else_text').val().length)? $('.track_else_text').val() : '';
            } else {
                $('input#track_4').prop('checked',false);
                action_plan.user_input.track_else = '';
                $('.track_else_text').val('');
            }
        break;
        default:
        break;
    }

    if ($(obj).hasClass('track_else_text')){
        action_plan.user_input.track_else = $('.track_else_text').val();
    }

    $('li.ap_list_item[ap_step="7"]').find('p.line_desc_2').html(populate_track_methods());
};

var bind_confidence_selection = function(){
    $('body').on('click', 'li.confidence_icon', function() {
        $('li.confidence_icon').each(function(){
            $(this).removeClass('confidence_selected scale-selected');
        });
        $(this).addClass('confidence_selected scale-selected');

        var confidence_level = $(this).html();

        action_plan.user_input.confidence_level = confidence_level;
        $('li.ap_list_item[ap_step="8"]').find('p.line_desc_2').html(confidence_level);

        if (confidence_level < 8) {
            $('div.confidence_warn').removeClass('hidden_obj');
            $('span.warn_value').html(confidence_level);
        } else {
            $('div.confidence_warn').addClass('hidden_obj');
        }

    });
};

var populate_confidence = function(){
    if (action_plan.user_input.confidence_level > 0) {
        $('li.confidence_icon').each(function(){
            $(this).removeClass('confidence_selected scale-selected');
        });

        var selected_confidence = action_plan.user_input.confidence_level -1;
        $('li.confidence_icon').eq(selected_confidence).addClass('confidence_selected scale-selected');

        if (selected_confidence < 8) {
            $('div.confidence_warn').removeClass('hidden_obj');
            $('span.warn_value').html(selected_confidence);
        } else {
            $('div.confidence_warn').addClass('hidden_obj');
        }

    }
};

var parse_user_input = function() {
    var i = 1;
    var slide = true;
    do {
        slide = validate_answers(i)
        i++;
    }
    while (slide && i <= 9);
}

var validate_answers = function(slide_number) {
    switch (slide_number*1)
    {
        case 1:
            if (action_plan.user_input.my_goal > 0) {
                action_plan.steps[1] = true;
                return true;
            } else {
                action_plan.current_step = 1;
                return false;
            }
        break;


        case 2:
            var completed_inputs = 0;

            if ( action_plan.user_input.brain_storm_opt_1 != null &&  action_plan.user_input.brain_storm_opt_1.length > 0 ) {
                completed_inputs++;
            };

            if ( action_plan.user_input.brain_storm_opt_2 != null &&  action_plan.user_input.brain_storm_opt_2.length > 0 ) {
                completed_inputs++;
            };

            if ( action_plan.user_input.brain_storm_opt_3 != null &&  action_plan.user_input.brain_storm_opt_3.length > 0 ) {
                completed_inputs++;
            };

            if (completed_inputs >=2) {
                action_plan.steps[2] = true;
                return true;
            }

            action_plan.current_step = 2;
            return false;

        break;

        case 3:
            if (action_plan.user_input.brain_storm != null && action_plan.user_input.brain_storm.length > 0) {
                action_plan.steps[3] = true;
                return true;
            } else {
                action_plan.current_step = 3;
                return false;
            }
        break;
        case 4:
            if (action_plan.user_input.plan_text != null && action_plan.user_input.plan_text.length > 0) {
                 action_plan.steps[4] = true;
                 return true;
            } else {
                action_plan.current_step = 4;
                return false;
            }
        break;
        case 5:
            if (action_plan.user_input.barrier_text != null && action_plan.user_input.barrier_text.length > 0) {
                action_plan.steps[5] = true;
                return true;
            } else {
                action_plan.current_step = 5;
                return false;
             return;
            }
        break;
        case 6:
            if (action_plan.user_input.strategy_text != null && action_plan.user_input.strategy_text.length > 0) {
                action_plan.steps[6] = true;
                return true;
            } else {
                action_plan.current_step = 6;
                return false;
            }
        break;
        case 7:
            if (action_plan.user_input.track_app != 0 || action_plan.user_input.track_calendar != 0 || action_plan.user_input.track_paper != 0 || (action_plan.user_input.track_else != '' || action_plan.user_input.track_else.length != 0)){
                action_plan.steps[7] = true;
                 return true;
            } else {
             action_plan.current_step = 7;
             return false;
        }
        break;
        case 8:
            if (action_plan.user_input.confidence_level != null && action_plan.user_input.confidence_level != '') {
                 action_plan.steps[8] = true;
                return true;
            } else {
                action_plan.current_step = 8;
                return false;
            }
        break;
        case 9:
            action_plan.current_step = 9;
            return true;
        break;
    }
};

var bind_freeform = function(){
    $('body').on('click', '.freeform', function(){

        //having to do these via JS since the tx stuff is not available to our JS code.
        var custom_goal_text = '';
        var save_goal_text   = '';
        var cancel_goal_text = '';

        if ($('a.lang_url').hasClass('spanish')) { //we're in english.
            custom_goal_text = 'Add your custom goal here';
            save_goal_text   = 'Save';
            cancel_goal_text = 'Cancel';

        } else {  //we're in spanish.
            custom_goal_text = 'Añada su objetivo personalizado aquí';
            save_goal_text   = 'Guardar';
            cancel_goal_text = 'Cancelar';
        }

        $('div#ap_mutable').empty();
        $([
            '<div class="push spacer">',
                '<label class="sizer">',
                    '<input type="text" class="inputer custom_goal" placeholder="'+custom_goal_text+'">',
                '</label>',
            '</div>'
        ].join('\n'))
            .appendTo('div#ap_mutable');

        $('<button class="save_goal pure-button button-green">'+save_goal_text+'</button>')
            .on('click', function(e){
                e.preventDefault();
                var goal_name = $('input.custom_goal').val();

                if (typeof goal_name == 'undefined' || goal_name.length < 1) {
                    alert('Please give your goal a name.');
                    return;
                }

                $.post('api/savecustomgoal', {batch_id: action_plan.batch_id, goal_name: goal_name}, function(data){
                    json = JSON.parse(data);
                    if (json.status == 'success') {
                        action_plan.user_input.my_goal = json.goal_id;
                        load_goals();
                   }
                });
            })
            .appendTo('div#ap_mutable');

        $('<button class="free_form_cancel pure-button button-red">'+cancel_goal_text+'</button>')
            .on('click', function(e){
                $('div#ap_mutable').empty();
                load_goals();
            })
            .appendTo('div#ap_mutable');

    });
};

var populate_next_steps = function(){
    if (action_plan.user_input.coached*1 == 1){
        $('.followup_container').removeClass('hidden_obj');
    }

    if (typeof action_plan.user_input.start_date != 'undefined' && action_plan.user_input.start_date != '') {
        $('.ap_start_date').val(action_plan.user_input.start_date);
    } else {
        var dateo = new Date()
        $('.ap_start_date').val( (dateo.getMonth() + 1) + '/' + dateo.getDate() + '/' +  dateo.getFullYear()   );
    }

    bind_ap_finish();
    bind_start_date();
}

var bind_ap_finish = function(){
    $('body').on('click', 'a.finalize_ap', function(e){
        e.preventDefault();

        $.post('api/finishAP', {'batch_id' : action_plan.batch_id }, function(data) {
        }).done(function(){
            window.location = '/printActionPlan?action_plan_id='+action_plan.batch_id+'&mode=summary';
        });
    });
}

var bind_start_date = function() {
    $('body').on('blur', '.ap_start_date', function(){
        action_plan.user_input.start_date = $(this).val();
        $.post('api/updateactionplan', {'user_input': action_plan.user_input, 'batch_id' : action_plan.batch_id }, function(data) {
            if (action_plan.batch_id != data) {
                action_plan.batch_id = data;
                action_plan.current_step = 1;
                validate_step();
                display_slide();
            }
        });
    });
};

var populate_tabs = function(){
    for (step = 3; step <= 8; step++) {
        switch (step){
            case 3:
                $('li.ap_list_item[ap_step="3"]').find('p.line_desc_2').html(action_plan.user_input.brain_storm);
            break;

            case 4:
                $('li.ap_list_item[ap_step="4"]').find('p.line_desc_2').html(action_plan.user_input.plan_text);
            break;

            case 5:
                $('li.ap_list_item[ap_step="5"]').find('p.line_desc_2').html(action_plan.user_input.barrier_text);
            break;

            case 6:
                $('li.ap_list_item[ap_step="6"]').find('p.line_desc_2').html(action_plan.user_input.strategy_text);
            break;

            case 7:
                $('li.ap_list_item[ap_step="7"]').find('p.line_desc_2').html(populate_track_methods());
            break;

            case 8:
                $('li.ap_list_item[ap_step="8"]').find('p.line_desc_2').html(action_plan.user_input.confidence_level);
            break;
        }
    }
}

var populate_track_methods = function(){
    string = '';
    string += (action_plan.user_input.track_app*1 == 1)? ' App, ':'';
    string += (action_plan.user_input.track_paper*1 == 1)? ' Paper, ':'';
    string += (action_plan.user_input.track_calendar*1 == 1)? ' Calendar, ':'';
    string += (action_plan.user_input.track_else != null && action_plan.user_input.track_else.length> 0 )? 'Other: '+ action_plan.user_input.track_else:'';

    string = string.trim();
    return string.replace(/,$/, '');
}

var bind_health_tip_modal = function() {
    $('body').on('click', '.ap_modal_popper', function(event) {
        event.preventDefault();
        var $this = $(this);
        if ($this.hasClass('ap_tips')) {
            manage_modal('action-plan-ap-tips', 'open');
        } else if ($this.hasClass('health_tips')) {
            manage_modal('action-plan-health-tips', 'open');
        }
    });
};

var bind_moti_selectors = function() {
    $('body').on('click', 'a.moti_display', function(e){
        e.preventDefault();
        if ($(this).hasClass('show_section')) {
            $('.action_plan_moti_container').removeClass('hidden_obj');
        } else if ( $(this).hasClass('hide_section')){
            $('.action_plan_moti_container').addClass('hidden_obj');
        }
    });

    $('body').on('click', '.moti_save', function(e){
            var payload = {};
            payload.user_data = {};

            payload.user_data.start_date     = action_plan.user_input.start_date;
            payload.user_data.action_plan_id = action_plan.batch_id;
            payload.user_data.event_time_hour        = $('.moti_hour').val();
            payload.user_data.tod         = $('.moti_tod').val();
            payload.user_data.event_time_minutes      = $('.moti_minute').val();
            payload.user_data.frequency   = $('.motivation_freq').val();
            payload.user_data.receive_method = $('.moti_delivery').val();
            payload.user_data.message     = $('.motivation_message_body').val();

            var email_address = $('.moti_email').val();
            var mobile_phone  = $('.moti_phone').val();

            if (email_address.length > 0) {
                payload.user_data.user_email = email_address;
            }

            if (mobile_phone.length > 0 ) {
                payload.user_data.user_mobile = mobile_phone;
            }

            $.post('/api/setMotiPrompt', payload, function(data){
               if (JSON.parse(data).success*1 == 1) {
                   alert('Your motivational prompt has been created');
                   $('.action_plan_moti_container').addClass('hidden_obj');
               } else {
                   console.log('an error has occurred');
               }
            });
    });

    $('body').on('keyup', '.motivation_message_body', function(e){
        var char_len = $('.motivation_message_body').val().length;
        if (char_len > 140 ) {
            $('.motivation_message_body').val(
                function(index, value){
                    return value.substr(0, value.length - (value.length - 140));
            })
            char_len--;
        }
        $('span.moti_counter').html(140 - char_len);
    });
};
