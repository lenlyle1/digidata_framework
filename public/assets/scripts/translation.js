var Translator = {

    init: function(){
        $('body').on('click', '.edit-button', function(){
            Translator.edit($(this).closest('tr'));
        })
        $('body').on('click', '.update-button', function(){
            Translator.save($(this).closest('tr'));
        })
    },

    edit: function(row){
        var key = $(row).data('key');
        var enTd = row.find('td.en');
        var esTd = row.find('td.es');
        console.log(enTd);
        enTd.html('<textarea data-autoresize id="'+key+'_en" class="col-md-12">'+enTd.find('div').html()+'</textarea>');
        esTd.html('<textarea data-autoresize id="'+key+'_es" class="col-md-12">'+esTd.find('div').html()+'</textarea>');

        $.each($('textarea[data-autoresize]'), function() {
            Translator.resizeTextarea(this);
        });

        Translator.triggerResizer();


        $(row).find('.edit-button').hide();
        $(row).find('.update-button').show();
    },

    save: function(row){

        var key = $(row).data('key');
        console.log(row);
        var enTd = row.find('td.en');
        var esTd = row.find('td.es');
        var enTxt = enTd.find('textarea').val();
        var esTxt = esTd.find('textarea').val();
        // ajax save
        $.ajax(apiLangUpdateUrl+'?auth_id='+auth_id+'&auth_public='+auth_public, {
            data : {itemKey: key,
                    enTxt: enTxt,
                    esTxt: esTxt},
            type : 'POST',
            success: function(data){
                // put divs back
                Logging.log(enTxt);
                $(enTd).html('<div>'+enTxt+'</div>');
                $(esTd).html('<div>'+esTxt+'</div>');
                // revert row
                $(row).find('.edit-button').show();
                $(row).find('.update-button').hide();
            }
        });
    },

    resizeTextarea: function(el) {

        var offset = el.offsetHeight - el.clientHeight;

        $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
    },

    triggerResizer: function(){
        $.each($('textarea[data-autoresize]'), function() {

            var offset = this.offsetHeight - this.clientHeight;

            var resizeTextarea = function(el) {
                $(el).css('height', 'auto').css('height', el.scrollHeight + offset);
            };
            $(this).on('keyup input', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
        });
    }
}

$(document).ready(function(){
    Translator.init();
});


