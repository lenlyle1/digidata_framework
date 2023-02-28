
var health_areas = [];
var survey_id =  $("meta[name='survey_id']").attr('content');
$(document).ready(function(){
    loadSurveys();
    bindAreaClicker();
    bindSaveHealthArea();
    bindAPStart();
    bindResultPrint();
    bindExport();

    $('.tap_text_pick').click(function(e){
        var texto =  $(this).parent().parent().find('.tap_text').text();
        e.preventDefault();

        $('#tap_text_full').text(texto);

        var $modal = $('[data-remodal-id="survey-more-info"]');
        // Open by default:
        action = '';
        action = (action || 'open');
        if ($modal.length) {
            $modal.remodal()[action]();
        }
    });

    $('.long_text').addClass('hidden_obj');

    $('.short_text > a').click(function(e){
        e.preventDefault();
        $(this).parent().next('div').toggleClass('hidden_obj');
    });
});

$('body').on('change',  'select.survey_load', function(){
    window.location = "surveyresults?batch_id="+$(this).val();
});


var bindResultPrint = function(){
    $(".btnPrint").printPage();
}


var loadSurveys = function(){
    $.get('api/fetchsurveylist', function(data){
        var json = null;
        try {
            json = JSON.parse(data);
        }
        catch(e) {
            console.log(e);
        }

        if (json) {
            $.each(json.payload, function(e,v){
                $('<option/>').val(v.batch_id).text('Survey Date: '+v.time_stamp).appendTo('select.survey_load');
            });
        } else {
            var $modal = $('[data-remodal-id="no_survey"]');
            action = '';
            action = (action || 'open');
            if ($modal.length) {
                $modal.remodal()[action]();
            }
        }
    });
}

var bindAreaClicker = function(){
   $('body').on('click', '.next_step_opt', function(){

       if ( $(this).is(':checked') == true) {
           if (health_areas.length < 2) {
               health_areas.push(    $(this).attr('id'));

           } else {
               $(this).prop('checked', false);
           }
       } else {
           health_areas.splice(health_areas.indexOf($(this).attr('id')), 1);
       }

       if (health_areas.length == 1 ||  health_areas.length == 2) {
          console.log('enable the save button');
          $('.save_health_areas').removeClass('pure-button-disabled');
       } else {
           console.log('disable the save button');
           $('.save_health_areas').addClass('pure-button-disabled');
           $('.ap_start').addClass('pure-button-disabled')
       }
    console.log(health_areas);
   });
};

var bindSaveHealthArea = function(){
    $('body').on('click', '.save_health_areas', function(){
        if ($(this).hasClass('pure-button-disabled')) {
            console.log("You shouldn't be here");
            return false;
        }

        for (i = 0, obj = {}; i <= health_areas.length-1; i++) {
            obj['area_'+i] = health_areas[i];
        }

        $.post('/api/savehealthareas', {'survey_id': survey_id, 'survey_areas' : obj}, function(data){
        }).done(function(){
            $('.ap_start').removeClass('pure-button-disabled')
            console.log('we should now redirect to the action plan');
        });
    });
};

var bindAPStart = function(){
    $('body').on('click', '.ap_start', function(){
        window.location =  '/actionplan';
        return;
    });
}

/*
    <a class="pure-button pure-button-primary" href='/pdfexport?page_type=action_plan&item_id={$value.batch_id}'>Save as PDF</a>
*/



var bindExport = function() {
/*

$('body').on('click', '.download', function(e){
    e.preventDefault();



        console.log('download pdf clickeroo!');
        //window.location =  '/actionplan';
        //return;
    });
*/


}


