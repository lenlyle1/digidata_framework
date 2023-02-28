(function($) {

    var audio_points;
    var audio_elements;
    var current_time = 0;
    var $last_highlight = '';
    var highlight_class = 'highlight';
    var json = {};

    function getSrcParts(src) {

        var parts;
        var id;
        var lang;

        // Get file name `a3_2_vegetables_EN.mp3`:
        src = src.split(/(\\|\/)/g).pop();
        // Remove extension `a3_2_vegetables_EN`:
        src = src.slice(0, -4);
        // Break down the string into parts:
        parts = src.split('_');
        // Get language:
        lang = parts.splice(parts.length - 1).toString().toLowerCase();
        // Now create the identifier:
        id = parts.join('_');

        return {
            id: id,
            lang: lang
        };

    }

    function startHighlight() {

        $('.audio').on('click.highlight', function() {

            var $audio = $(this).children('audio');
            var audio = $audio[0];
            var parts;
            var interval;
            var data;

            if (audio.paused === false) {

                parts = getSrcParts($audio.attr('src'));
                data = $.extend(true, {}, json[parts.id]); // Make a deep copy.

                if ( ! $.isEmptyObject(data)) {

                    $audio.one('play.highlight', function() {

                        var started = false;

                        interval = setInterval(function() {

                            var points = data.points[parts.lang];
                            var start;
                            var end;
                            var elements;
                            var element;

                            if (points.length) {

                                start = points[0][0];
                                end = points[0][1];
                                elements = data.elements;
                                element = elements[0];

                                if (( ! started) && (audio.currentTime >= start)) {

                                    started = true;

                                    //console.log('It is!', start, end, element);

                                    $last_highlight = $(element);

                                    $last_highlight.addClass(highlight_class);

                                }

                                //console.log(start, end);

                                if (started && (end !== 0) && (audio.currentTime >= end)) {

                                    //console.log('ENDED!');

                                    if ($last_highlight.length) {

                                        $last_highlight.removeClass(highlight_class);

                                    }

                                    elements.shift();
                                    points.shift();

                                    started = false;

                                }

                            }

                        }, 150);

                    });

                    $audio.one('pause.highlight end.highlight', function() {

                        clearInterval(interval);

                        if ($last_highlight.length) {

                            $last_highlight.removeClass(highlight_class);

                        }

                        $audio.off('.highlight');

                    });

                }

            }

        });

    }

    $.getJSON('/assets/data/audio.json?v=20170526', function(data) {

        json = data;

        startHighlight();

    });

})(jQuery);
