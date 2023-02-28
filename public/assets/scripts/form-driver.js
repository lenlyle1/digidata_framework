$(document).ready(function(){
    if (typeof localStorage.getItem('survey_id') != 'null' && localStorage.getItem('survey_id') > 0 && localStorage.getItem('resume_survey') == 'true') {

        //we only want this workflow to fire once:
        localStorage.removeItem('resume_survey');

        $('body').trigger('storage_set');
        $('#form_container').removeClass('hidden_obj');
        $('#survey_selection').addClass('hidden_obj');
    } else {
        localStorage.removeItem('page_number');
        localStorage.removeItem('survey_id');
    }

    $('#alcohol_slider').on('input change', function(){
        $('span.alcohol_slider_value').html( $(this).val());
        $('meta[name="alcohol_set"]').attr('content','true');
    });

    $('a.height_updater').click(function(e){
        e.preventDefault();
        $('.height_container').toggleClass('hidden_obj');
    });

    $('body').on('click', '.alcohol_slider_control', function(e){
        e.preventDefault();
        var cur_val = $('#alcohol_slider').val();

        $('meta[name="alcohol_set"]').attr('content','true');

        if ( $(this).hasClass('up')) {
            new_val = parseInt(cur_val) +1;
            if (new_val > 21) {
                return;
            }
        } else if ($(this).hasClass('down')) {
            new_val = parseInt(cur_val) -1;
            if (new_val < 0) {
                return;
            }
        }

        $('#alcohol_slider').val(new_val);
        $('span.alcohol_slider_value').html(new_val);
    });

    $('#missed_med_slider').on('input change', function(){
        $('span.missed_med_slider_value').html( $(this).val());

         $('meta[name="medicine_set"]').attr('content','true');
        med_check($(this).val());
    });

    $('body').on('click', '.missed_med_slider_control', function(e){
        e.preventDefault();
        var cur_val = $('#missed_med_slider').val();

         $('meta[name="medicine_set"]').attr('content','true');
        if ( $(this).hasClass('up')) {
            new_val = parseInt(cur_val) +1;
            if (new_val > 14) {
                return;
            }
        } else if ($(this).hasClass('down')) {
            new_val = parseInt(cur_val) -1;
            if (new_val < 0) {
                return;
            }
        }
        $('#missed_med_slider').val(new_val);
        $('span.missed_med_slider_value').html(new_val);
        med_check(new_val);
    });

    $('input[name="tobacco_usage"]').change(function(){
        tobacco_total_check( $(this).val());
    });

    $('input[name="cigarette_usage"]').change(function(){
        cigarette_check( $(this).val());
    });

    $('input[name="pipe_cigar"]').change(function(){
         pipe_cigar_check( $(this).val());
    });

    $('input[name="fat_consumption"]').change(function(){
        fat_check( $(this).val());
    });

    $('input[name="overwhelmed_health"], input[name="health_management"]').change(function(){
        health_stress();
    });

    $('input[name="vegetable_servings"], input[name="salt"], input[name="fruit_servings"] , input[name="weekly_sugar_soda"] , input[name="processed_foods"], input[name="fat_consumption"]').change(function(){
        diet_check();
    });

    $('input[name="weekly_exercise_days"], input[name="exercise_duration"] ').change(function(){
        exercise_check();
    });


     $('input[name="feeling_hopeless"], input[name="adhedonia"]').change(function(){
         depression_check();
     });

     $('.health_form_submit').click(function(e){
        e.preventDefault();
        console.log('submit was clicked');
    });

    $('.survey_navigator').click(function(e){
        e.preventDefault();

        localStorage.removeItem('page_number');
        localStorage.removeItem('survey_id');

        e.preventDefault();
        var url = ($(this).hasClass('start_survey'))? 'api/surveyNewBatch' : 'api/surveyGetLastBatch';
        $.ajax(url, {
            data : {},
            type : 'POST',
            success: function(data) {}
        }).done(function(data){
            //make sure we got a valid batch_id....
            if (typeof(JSON.parse(data).payload) == 'undefined' || JSON.parse(data).payload == null) {
                console.log ('error setting our batch_id');
            } else {
                json = JSON.parse(data).payload;
                localStorage.setItem('survey_id', json.batch_id);
                localStorage.setItem('page_number', json.page_number*1);
                $('body').trigger('storage_set');
                $('#form_container').removeClass('hidden_obj');
                $('#survey_selection').addClass('hidden_obj');
            }
        });
     });
});    //END OF .Ready

function med_check(value){
    if (value < 2) {
        $('.med_check').addClass('hidden_obj');
    }else {
        $('.med_check').removeClass('hidden_obj');
    }
}

function fat_check(value){
    if (value == 0) {
        $('div.portion_size_container').addClass('hidden_obj');
    }else {
        $('div.portion_size_container').removeClass('hidden_obj');
    }
}

function tobacco_total_check(value){
    if (value == 0) {
        $('.tobacco_t2, .pipe_t2').addClass('hidden_obj');
        $('input[name="cigarettes_per_day"]').val(0);  //unset pipe/cigar last week.
        $('input[name="pipe_cigar_frequency"]').val(0);
        $('input[name="smokeless_tobacco"]').prop('checked', false);  //unset pipe/cigar last week.
        $('input[name="pipe_cigar"]').prop('checked', false);
    } else {
        $('div.tobacco_t2').removeClass('hidden_obj');
    }
}

function cigarette_check(value){
    if (value == 0) {
        $('input[name="cigarettes_per_day"]').val('0').parents.addClass('hidden_obj');
    } else {
        $('input[name="cigarettes_per_day"]').val('').parents.removeClass('hidden_obj');
    }
}

function pipe_cigar_check(value){
    if (value == 0) {
        $('div.pipe_t2').addClass('hidden_obj');
        $('input[name="pipe_cigar_frequency"]').val(0);
    } else {
        $('div.pipe_t2').removeClass('hidden_obj');
    }
}

function health_stress(){
    var overwhelmed_health = $('input[name="overwhelmed_health"]:checked').val()  || 0;
    var health_management  = $('input[name="health_management"]:checked').val()  || 0;

    if ( (overwhelmed_health*1 + health_management*1) /2 >= 2) {
        $('.health_stressors').removeClass('hidden_obj');
    } else {
        $('.health_stressors').addClass('hidden_obj');
        $('input[name="health_stress"]').each(function(){
            $(this).prop('checked', false);
        });
    }
}

function exercise_check(){
    if (typeof $('input[name="weekly_exercise_days"]:checked').val() == 'undefined') {
        return;
    }

    if ($('input[name="weekly_exercise_days"]:checked').val()*1 == 0 ) {
        $('div.exercise_duration').addClass('hidden_obj');
        $('div.exercise_reasons').removeClass('hidden_obj');
    } else {
        $('div.exercise_duration').removeClass('hidden_obj');
        $('div.exercise_reasons').addClass('hidden_obj');
    }

    if (typeof $('input[name="exercise_duration"]:checked').val() != 'undefined') {
        var exercise_days   = $('input[name="weekly_exercise_days"]:checked').val() || 0;
        var session_minutes = $('input[name="exercise_duration"]:checked').val() || 0;
        if ( (exercise_days * session_minutes) < 150) {
            $('div.exercise_reasons').removeClass('hidden_obj');
        } else {
            $('input[name="exercise_reasons"]').each(function(){
                $(this).prop('checked',false);
            });
            $('div.exercise_reasons').addClass('hidden_obj');
        }
    }
}

function diet_check(){
    if (
        $('input[name="vegetable_servings"]:checked').val() <  4 ||
        $('input[name="fruit_servings"]:checked').val()     <  4 ||
        $('input[name="fat_consumption"]:checked').val()    >= 2 ||
        $('input[name="weekly_sugar_soda"]:checked').val()  >= 2 ||
        $('input[name="processed_foods"]:checked').val()    >= 3 ||
        $('input[name="salt"]:checked').val()   == 1
        ){
            $('.diet_rollup').removeClass('hidden_obj');
     } else {
         $('.diet_rollup').addClass('hidden_obj');
         $('input[name="eating_better"]').each(function(){
             $(this).prop('checked', false);
         });
    }
}

function depression_check(){
    if (typeof $('input[name="adhedonia"]:checked').val() == 'undefined' || typeof $('input[name="feeling_hopeless"]:checked').val() == 'undefined') {
         $('.depression_check').addClass('hidden_obj');
         return;
    }

    var adhedonia = $('input[name="adhedonia"]:checked').val()*1 || 0;
    var hopeless  = $('input[name="feeling_hopeless"]:checked').val()*1 || 0;

    if (adhedonia + hopeless >= 3) {
        $('.depression_check').removeClass('hidden_obj');
    } else {
        $('.depression_check').addClass('hidden_obj');
    }
}
