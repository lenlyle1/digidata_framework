/**
 * This could use a lot more work.
 *
 * @see http://www.amitpatil.me/multi-step-form-with-progress-bar-and-validation/
 */

(function($, document, window, undefined) {
    'use strict';
    var $fp = $('#form-pager');

    function main() {
        var current = localStorage.getItem('page_number') || 1;
        var $document = $(document);
        var $progress = $('#progress');
        var $toggle = $('.step-control-toggle');
        var $show = $('.step-control-show');
        var $hide = $('.step-control-hide');
        var $form = $fp.find('form');
        var $step = $fp.find('.step');
        var $nav = $fp.find('.steps-nav');
        var $prev = $fp.find('.steps-nav-prev');
        var $prev_button = $prev.children('.button');
        var $next = $fp.find('.steps-nav-next');
        var $next_button = $next.children('.button');
        var $submit = $fp.find('.steps-nav-submit');
        var $submit_button = $submit.children('.button');
        var top = function() { $document.scrollTop(0); };
        // Change progress bar action:
        var progress = function(step) {
            var percent = parseFloat(100 / $step.length) * step;
            percent = percent.toFixed();
            $progress
                .children('div')
                .css('width', percent + '%')
                .end()
                .children('span')
                .text(percent + '%');
        };

        var buttons = function(step) {
        if (step > 1) {
            $('div.steps-nav-close').addClass('hidden_obj');
                window.onbeforeunload = function() {
                    return "Are you sure you want to navigate away?";
                }
            } else {
                $('div.steps-nav-close').removeClass('hidden_obj');
                window.onbeforeunload = function() {
                    return null;
                }
            }

            var limit = parseInt($step.length);

            $next.hide();
            $prev.hide();
            $submit.hide();

            if (step < limit) {
                $next.show();
            }

            if (step > 1) {
                $prev.show();
            }

            if (step == limit) {
                $next.hide();
                $submit.show();
            }

        };

        var hash = function() {
            var what = window.location.hash;
            var $what = $(what);

            if ($what.length && $what.hasClass('step')) {
                if (what) {
                    current = ($fp.find('.step').index($what) + 1);
                }
                go();
            }
        };

        var go = function() {
            $step
                .show()
                .not(':eq(' + (current - 1) + ')')
                .hide();

            buttons(current);
            progress(current);

        };
        var control = function(kind) {
            var self = this;
            var $this = $(self);
            var $data = $this.data('pageIds');
            var $rules = $this.data('pageRules');
            var $elements = $($data);
            var $count = $elements.length;

            if ($rules && $rules.length) {
                $.each($rules.split(','), function(index, value) {
                    if ($.isFunction(window[value])) {
                        kind = window[value].call(self);
                    }
                });
            }

            switch(kind) {
                case 'toggle':
                    $elements
                        .toggleClass('step step-hide');
                    break;
                case 'show':
                    $elements
                        .removeClass('step-hide')
                        .addClass('step');
                    break;
                case 'hide':
                    $elements
                        .removeClass('step')
                        .addClass('step-hide');
                    break;
            }

            $step = $fp.find('.step');

            current = ($step.index($this.parents('.step')) + 1);

            go();

        };


        var valid = function() {
            current = localStorage.getItem('page_number');

            $step.show();
            $step.not(':eq(' + (current-1) + ')').hide();
            top();

            progress(current);
            buttons(current);
        }

        var poster = function(final) {
            var survey_id = localStorage.getItem('survey_id');
            var post_data = {};

            if ($form.valid()) {
                var current_form_elem = '';
                var names_to_check = [];

                //get all the inputs on the current page.
                $.each ($step.eq(current-1).find('input, textarea, select'), function(e,v) {
                    names_to_check.push($(this).attr('name'));
                });

                var wark = Array.from(new Set(names_to_check));    //gets all the unique name's on the page. :(
                for (var i = 0; i <= (wark.length -1); i++) {
                    var current_node = wark[i];

                    if ($('select[name="'+current_node+'"]').length) {
                        post_data[current_node] = [];
                        post_data[current_node].push($('select[name="'+current_node+'"]').val());
                    } else if($('input[name="'+current_node+'"]').attr('type') == 'checkbox' || $('input[name="'+current_node+'"]').attr('type') == 'radio') {
                        post_data[current_node] = [];
                        if ($('input[name="'+wark[i]+'"]:checked').length == 0) {
                            post_data[current_node].push(0);
                        } else {
                            $.each ( $('input[name="'+wark[i]+'"]:checked'), function(e,v) {
                                post_data[current_node].push($(v).val());
                            });
                        }
                    } else if($('input[name="'+current_node+'"]').length  &&  $('input[name="'+wark[i]+'"]').prop('tagName') === 'INPUT') {
                            post_data[current_node] = [];
                            post_data[current_node].push($('input[name="'+current_node+'"]').val());
                    }
                };

                if  ( Object.keys(post_data).length > 0)  {
                    $.ajax('api/surveysubmit', {
                        data : {'survey_id' : localStorage.getItem('survey_id'), 'survey_data': post_data},
                        type : 'POST',
                        beforeSend: function() {
                            $next.addClass('pure-button-disabled');
                        },
                        success: function(data) {
                            $next.removeClass('pure-button-disabled');
                        }
                    }).done(function(){
                        if (final !== 'undefined' && final === true) {
                            //we want to allow the user to navigate away from the page when they click finish.
                            window.onbeforeunload = function() {return null;}

                            console.log('okay now we need to finalize this survey');
                            $.ajax('api/surveyfinalize', {
                                data : {'batch_id' : localStorage.getItem('survey_id')},
                                type : 'POST',
                                success: function(data) {
                                    console.log(data);
                                }
                            }).done(function() {
                                window.location = '/surveyresults?batch_id='+survey_id;
                            });
                        } else {
                         page_nav('fwd');
                        }
                    });
                } else {
                   page_nav('fwd');
                }
            }
        };

        var page_nav = function(direction) {
            if (typeof direction == 'undefined') {
                valid();
                return;
            }

            var current_page = localStorage.getItem('page_number');
            var survey_id    = localStorage.getItem('survey_id');
            if (direction == 'bck') {
                current_page--;
            } else if (direction == 'fwd') {
                current_page++;
            } else {
                console.log('error with page nav!');
                return;
            }


            $.ajax('api/setPageNav', {
                data : {'survey_id' : survey_id, 'page_number': current_page},
                type : 'POST',
                success: function(data) {}
            }).done(function(){
                localStorage.setItem('page_number', current_page);
                valid();
            });
        };

        $submit_button.click(function(){
            poster(true);
        });

        $form.validate({
            ignore: ':not(:visible)',
            errorElement: 'span',
            errorPlacement: function(error, element) {}, // Hides the error message.
            errorClass : 'invalid',
            highlight: function(element, errorClass, validClass) {
                $(element)
                    .addClass('error')
                    .parents('.group')
                    .addClass('error');
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element)
                    .removeClass('error')
                    .parents('.group')
                    .removeClass('error');
            },
            rules: {
                weekly_alcohol_units: {
                    alcohol_modified: true
               },
               missed_med_days: {
                    medicine_modified: true
               }
            },
            focusInvalid: false,
            invalidHandler: function(form, validator) {
                if (!validator.numberOfInvalids())
                    return;
                $(validator.errorList[0].element).focus();
                $('html, body').animate({
                    scrollTop: $(validator.errorList[0].element).offset().top-60
                }, 900);
            }
        });

        $toggle.change(function() {
            control.call(this, 'toggle');
        });

        $show.change(function() {
            control.call(this, 'show');
        });

        $hide.change(function() {
            control.call(this, 'hide');
        });

        $next.click(function($event) {
            $event.preventDefault();
            poster();
        });

        $prev.click(function($event) {
            $event.preventDefault();
            page_nav('bck');
        });

        $nav.show();
        go();
    }

    $(function() {

        jQuery.validator.addMethod("alcohol_modified", function(value, element) {
            var result = true;
            if ($('meta[name="alcohol_set"]').attr('content') != 'true') {
                if ( ! confirm('You entered zero drinks. Please confirm?')) {
                    result = false;
                }
            }
            $('meta[name="alcohol_set"]').attr('content', 'true');
            return result;
        });

        jQuery.validator.addMethod("medicine_modified", function(value, element) {
            var result = true;
            if ($('meta[name="medicine_set"]').attr('content') != 'true') {
                if ( ! confirm('You entered zero days. Please confirm?')) {
                    result = false;
                }
            }
            $('meta[name="medicine_set"]').attr('content', 'true');
            return result;
        });

        $('body').on('storage_set', function() {
            main();
        });

    });
}(jQuery, document, window));
