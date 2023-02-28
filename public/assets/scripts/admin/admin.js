$(function() {
    var $grid = $('.grid');

    if ($grid.length) {
        $grid.DataTable(
            {
            }
        );
    }

    var $transTable = $('#transTable');
    if ($transTable.length){
        $transTable.DataTable(
            {
              rowGroup: {
                  dataSrc: 0
              }
            }
        );
    }

    $('a[name=tabs]').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })


    if($('.flash-text').length){
        $('.flash-text').fadeIn('slow', function(){
            setTimeout(function(){
                $('.flash-text').fadeOut();
            }, 5000);
        });
    }

    $('.view-report').click(function(e) {
        e.preventDefault();
        var url = $(this).attr('data-href');
        $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">View Report</h4></div><div class="modal-body"><iframe width="100%" height="500" src="' + url + '" frameborder="0" marginheight="0" marginwidth="0" style="border:1px solid #999;display:block;background:#eee"></iframe></div><div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>').modal('show');
        return false;
    });

    // Defer hiding keyboard on login (https://stackoverflow.com/questions/5937339/ipad-safari-make-keyboard-disappear)
    setTimeout(function() {
        document.activeElement.blur();
        $('input').blur();
    }, 0);

    $('#dashboard-tabs').tabs({ active: 0 });

    $('.sidebar-toggle').click(function() {
        $('body').toggleClass('sidebar-open');
    });

});
