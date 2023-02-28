var TableEditor = {

    init: function(){
        // find the table
        $('table.editable').find('button.edit-button').each(function(){
            $(this).click(function(){
                TableEditor.editRow(this);
            })
        })
    },

    updateFunction: null,

    editRow: function(button){
        Logging.log('editing row');
        var row = $(button).closest('tr');

        $(row).find('td.edit').each(function(){
            var editBox = '<textarea>' + $(this).html() + '</textarea>';
            $(this).html(editBox);
        });

        this.changeButton(button, 'Update', function(){
            TableEditor.updateRow(button);
        });
    },

    updateRow: function(button){
        Logging.log('update');

        var row = $(button).closest('tr');

        Logging.log(row);

        if(this.updateFunction){
            Logging.log('calling update function')
            this.updateFunction(row);
        } else {
            Logging.log('No update function selected!!!')
        }
        Logging.log('here');
        var row = $(button).closest('tr');

        $(row).find('td.edit').each(function(){
            var text = $(this).find('textarea').val();
            $(this).html(text);
        });

        this.changeButton(button, 'Edit', function(){
            TableEditor.editRow(button);
        })
    },

    makeEditable: function(td){
        var editBox = '<textarea>' + $(td).html() + '</textarea>';
        $(td).html(editBox);
    },

    changeButton: function(button, text, callback){
        $(button).off().html(text).click(function(){
            callback();
        });
    }
}

$(document).ready(function(){
    //TableEditor.init();
})