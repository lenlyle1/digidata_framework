var Log = {

	output: false,

	write: function(msg){
		if(Log.output){
			console.log(msg);
		}
	}
}