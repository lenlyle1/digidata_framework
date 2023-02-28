window.addEventListener('DOMContentLoaded', function() {

    $('#username,#password').keyup(function(e) {
        var thiso = $(this);
        var string = thiso.val();
        thiso.val(string.replace(/`/g,''));

        if (e.keyCode == 13) {
            $('#login-form').submit()
        }
    });

    updateNav();
    (function (window, document) {
        var menu = document.getElementById('navigation');
        var toggle = document.getElementById('toggle');

        if (menu) {
            menu.classList.add('closed');
        }
        if (toggle) {
            toggle.classList.add('closed');
        }

        function toggleMenu() {
            $(toggle).toggleClass('opened closed');
            $(menu).slideToggle('fast', function() {
                $(this).toggleClass('opened closed');
            });
        }

        function closeMenu() {
            if (menu.classList.contains('opened')) {
                toggleMenu();
            }
        }

        if (document.getElementById('toggle') ) {
            document.getElementById('toggle').addEventListener('click', function (e) {
            toggleMenu();
        });
        }


        if($('.flash-text').length){
            $('.flash-text').fadeIn('slow', function(){
                setTimeout(function(){
                    $('.flash-text').fadeOut();
                }, 5000);
            });
        }
    })(this, this.document);

});

var updateNav = function(){
    var current_location = window.location.href.replace(/\\/g, '');
    $('a').each(function(){
        if ($(this).attr('href') != '/') {
            if (current_location.indexOf($(this).attr('href')) > 0) {
                $(this).addClass('nav_sub_selected');
                $(this).addClass('selected');
            }
        }
    });
};
