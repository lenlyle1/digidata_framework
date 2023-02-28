var FormError = {

    clearErrors: function(){
        $('.form-error').destroy();
    },

    showError: function(name, error){
        var holder = $('#'+name).parent();
        $(holder).append('<div class="form-error">'+error+"</div>");
    },

    handleError: function(error){
        alert(error);
    }
}