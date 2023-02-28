/*!
 * By Eharry.me (https://gist.github.com/Ema4rl/b8ef90be99205ddada5ef2cd6e632ebe)
 */
(function($) {
    'use strict';
    var slide = $('[data-slides]'),
        count = 0,
        slides = slide.data('slides'),
        len = slides.length,
        n = function () {
            if (count >= len) {
                count = 0;
            }
            slide.css('background-image', 'url("' + slides[count] + '")').show(0, function() {
                setTimeout(n, 10e3);
            });
            count++;
        };
    n();
})(jQuery);
