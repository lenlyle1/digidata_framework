// http://connectiontohealth.com/js/controllers/HealthSurveyCtrl.js
// http://connectiontohealth.com/js/controllers/HealthSurveySectionCtrl.js
// http://connectiontohealth.com/js/services/survey.js

(function($) {

    var $audios = $('.audio audio');
    var is_playing = false;

    var controls = {

        'start one': function(audio) {

            audio.play();

            is_playing = true;

            $(audio)
                .parent()
                .addClass('audio-play')
                .parent()
                .addClass('audio-playing');

        },

        'stop one': function(audio) {

            audio.pause();
            audio.currentTime = 0;

            is_playing = false;

            $(audio)
                .off('.audio')
                .parent()
                .removeClass('audio-play')
                .parent()
                .removeClass('audio-playing');

        },

        'stop all': function(audios) {

            var self = this;

            $.each(audios, function(index, audio) {

                self['stop one'](audio);

            });

        }

    };

    $('.audio').on('click.audio', function() {

        var $audio = $(this).children('audio');
        var audio = $audio[0];

        controls['stop all']($audios.not($audio).toArray());

        if (audio.paused === false) {

            controls['stop one'](audio);

        } else {

            $audio.one('ended.audio', function() {

                controls['stop one'](audio);

            });

            controls['start one'](audio);

        }

    });

    $('.steps-nav').on('click.audio', '> [class^="steps-nav-"]', function() {

        if (is_playing) {

            controls['stop all']($audios.toArray());

        }

    });

})(jQuery);
