var args = arguments[0] || {};

OS_IOS && $.cameraButton.addEventListener("click", function(_event) {
	$.cameraButtonClicked(_event);
});

$.feedTable.addEventListener("click", processTableClicks);

// handlers
$.cameraButtonClicked = function(_event) {
	// alert("user clicked camera button");

	var photoSource;

	Ti.API.debug('Ti.Media.isCameraSupported ' + Ti.Media.isCameraSupported);

	if (!Ti.Media.isCameraSupported) {
		photoSource = 'openPhotoGallery';
	} else {
		photoSource = 'showCamera';
	}

	Titanium.Media[photoSource]({
		success : function(event) {
			processImage(event.media, function(processResponse) {
				if (processResponse.success) {
					// create the row
					Ti.API.info("Process response "+JSON.stringify(processResponse));
					var row = Alloy.createController("feedRow", processResponse.model);

					// add the controller view, which is a row to the table
					if ($.feedTable.getData().length === 0) {
						$.feedTable.setData([]);
						$.feedTable.appendRow(row.getView(), true);
					} else {
						$.feedTable.insertRowBefore(0, row.getView(), true);
					}
				} else {
					alert("Error saving photo " + processResponse.message);
				}
			});
		},
		cancel : function() {
			// called when user cancels taking a picture
		},
		error : function(error) {
			// display alert on error
			if (error.code == Titanium.Media.NO_CAMERA) {
				alert('Please run this test on device');
			} else {
				alert('Unexpected error: ' + error.code);
			}
		},
		saveToPhotoGallery : false,
		allowEditing : true,
		// only allow for photos, no video
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};

function processTableClicks(_event) {
   if (_event.source.id === "commentButton") {
       handleCommentButtonClicked(_event);
   } else if (_event.source.id === "shareButton") {
      alert('Will do this later!!');
   }
}

function handleCommentButtonClicked(_event) {
   var collection = Alloy.Collections.instance("Photo");
   Ti.API.info("handleCommentButton "+JSON.stringify(_event));
   var model = collection.get(_event.row.row_id);
   Ti.API.info("handleCommentButton "+JSON.stringify(model));
   
   var controller = Alloy.createController("comment", {
      photo : model,
      parentController : $
   });

   // initialize the data in the view, load content
   controller.initialize();

   // open the view
   Alloy.Globals.openCurrentTabWindow(controller.getView());

}

function processImage(_mediaObject, _callback) {
	// since there is no ACS integration yet, we will fake it
	var photoObject = {
		image : _mediaObject,
		title : "Sample Photo " + new Date()
	};

	var parameters = {
		"photo" : _mediaObject,
		"title" : "Sample Photo " + new Date(),
		"photo_sizes[preview]" : "200x200#",
		"photo_sizes[iphone]" : "320x320#",
		// We need this since we are showing the image immediately
		"photo_sync_sizes[]" : "preview"
	};
	var photo = Alloy.createModel('Photo', parameters);

	photo.save({}, {
		success : function(_model, _response) {// debugger;
			Ti.API.info('success: ' + _model.toJSON());
			_callback({
				model : _model,
				message : null,
				success : true
			});
		},
		error : function(e) {// debugger;
			Ti.API.error('error: ' + e.message);
			_callback({
				model : parameters,
				message : e.message,
				success : false
			});
		}
	});
}

$.initialize = function(){
    loadPhotos();
};

  // Add the above code for the function initialize to feed.js

function loadPhotos() {
    var rows = [];

    // creates or gets the global instance of photo collection
    var photos = Alloy.Collections.photo || Alloy.Collections.instance("Photo");

    // be sure we ignore profile photos;
    var where = {
        title : {
            "$exists" : true
        }
    };

	var data = {
            order : '-created_at',
            where : where
    };

    photos.fetch({
        data : data,
        success : function(model, response) {
            photos.each(function(photo) {
                var photoRow = Alloy.createController("feedRow", photo);
                rows.push(photoRow.getView());
            });
            $.feedTable.data = rows;
            Ti.API.info(JSON.stringify(data));
        },
        error : function(error) {
            alert('Error loading Feed ' + e.message);
            Ti.API.error(JSON.stringify(error));
        }
    });
}
