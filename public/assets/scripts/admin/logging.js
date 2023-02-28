
var Logging = {
    log: function(value){
        if(!is_live) {
            console.log(value);
        }
    }
}