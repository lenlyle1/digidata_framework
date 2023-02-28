var Logwriter = {
    init: function(){
        $('.contains-audio').click(function(){
            Logging.log('click');
        })
    },
    logClick: function(item, type){

        Logging.log('logging ' + type);
        Logging.log(item);

        $.ajax({
            url: '/log-event',
           type: 'POST',
           data: {type: type, item: item},
            success: function(){

            }
       })
    }
}

$(document).ready(function(){

})