$(function() {
    (function() {

        var $date = $('.picker.picker-date > input');

        if ($date.length) {

            // You can get and set dates with moment objects:
            var picker = new Pikaday({
                field: $date[0],
                format: 'MM/DD/YYYY',
                minDate: new Date(),
                yearRange:[new Date().getFullYear(), +1],
                position: 'bottom right'
            });

            // Just using the demo code from:
            // https://github.com/dbushell/Pikaday
            // @TODO More setup is probably needed.
            picker.setMoment(moment().dayOfYear(366));

        }

    })();

    (function() {

        var $time = $('.picker.picker-time > input');

        if ($time.length) {

            $time.timepicker();

        }

    })();

    (function() {

        var $modal = $('.modal');

        if ($modal.length) {

            $modal.remodal({
                hashTracking: false
            });

        }

    })();

    (function() {

        var $nutshell = $('.nutshell');

        if ($nutshell.length) {

            $nutshell.nutshell({
                animIn: { opacity: 'show' },
                animOut: { opacity: 'hide' },
                speedIn: 0,
                speedOut: 0
            });

        }

    })();

});
