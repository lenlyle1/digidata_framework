var FileUploader = {
	
	filename: '',

	image_data: '',

	init: function(){
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			$('#dropzoneHolder').removeClass("hidden");

	        $.event.props.push('dataTransfer');
	        $('.dropzone').on({
	            dragenter: function(e) {
	                $(this).addClass('ddHover');
	            },
	            dragleave: function(e) {
	                $(this).removeClass('ddHover');
	            },
	            drop: function(e) {
	            	thisObj = $(this);
	                FileUploader.fileDrop(e, thisObj);
	                $(this).removeClass('ddHover');
	            }
	        })
        }
        $("#fileinput").on('change', function(e){        	
        	thisObj = $(this);
            FileUploader.fileSelect(e);
        })
	},

	fileSelect: function(e) {
		var files = e.target.files; // FileList object
		for (var i = 0, file; file = files[i]; i++) {
			FileUploader.insertImage(file);
        }
	},

	fileDrop: function(e, thisObj){
		e.stopPropagation();
        e.preventDefault();

        //var file = e.dataTransfer.files[0];
		var files = e.dataTransfer.files; // FileList object
		for (var i = 0, file; file = files[i]; i++) {
			FileUploader.insertImage(file);
        }
	},

	insertImage: function(file){
        var fileReader = new FileReader();

		fileReader.onload = (function(file) {
			console.log(file);
            return function(event) {
                FileUploader.filename = file.name;
                FileUploader.image_data = event.target.result;
                FileUploader.addImage(event.target.result);
            };
        })(file);
        fileReader.readAsDataURL(file);         
        try {
		    FileUploader.getOrientation(file, function(orientation) {
		        console.log(orientation);
		    });
		}
		catch(e) {
		    console.log('invalid EXIF Data');
		}
	},

	addImage: function(img){
		$('#imageHolder').append('<img style="max-width: 200px; max-height: 200px;" src="' + img + '">');
	},


	getOrientation: function(file, callback) {
	    var reader = new FileReader();
	    reader.onload = function(e) {

	        var view = new DataView(e.target.result);
	        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
	        var length = view.byteLength, offset = 2;
	        while (offset < length) {
	            var marker = view.getUint16(offset, false);
	            offset += 2;
	            if (marker == 0xFFE1) {
	                if (view.getUint32(offset += 2, false) != 0x45786966) callback(-1);
	                var little = view.getUint16(offset += 6, false) == 0x4949;
	                offset += view.getUint32(offset + 4, little);
	                var tags = view.getUint16(offset, little);
	                offset += 2;
	                for (var i = 0; i < tags; i++)
	                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
	                        return callback(view.getUint16(offset + (i * 12) + 8, little));
	            }
	            else if ((marker & 0xFF00) != 0xFF00) break;
	            else offset += view.getUint16(offset, false);
	        }
	        return callback(-1);
	    };
	    reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
	},

	fileUpload: function(file){
		//upload to server

			$.ajax({
				url : "/image/upload", // use your target
				type : "POST",
				data : uploadFormData,
				cache : false,
				contentType : false,
				processData : false,
				success : function(response) {
					// callback function
				}
	       });

	}
}