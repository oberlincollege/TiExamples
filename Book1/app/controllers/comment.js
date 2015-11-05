// Get the parameters passed into the controller: {photo: ..., parentController: ...}

var parameters = arguments[0] || {};
var currentPhoto = parameters.photo || {};
var parentController = parameters.parentController || {};

var comments = Alloy.Collections.instance("Comment");

OS_IOS && $.newCommentButton.addEventListener("click", handleNewCommentButtonClicked);

$.commentTable.addEventListener("delete", handleDeleteRow);
$.commentTable.editable = true;

function handleNewCommentButtonClicked(_event) {
	var navWin;
	var inputController = Alloy.createController("commentInput", {
		photo : currentPhoto,
		parentController : $,
		callback : function(_event) {
			inputController.getView().close();
			inputCallback(_event);
		}
	});

	// open the window
	inputController.getView().open();
}

function inputCallback(_event) {
	if (_event.success) {
		addComment(_event.content);
	} else {
		alert("No Comment Added");
	}
}

function addComment(_content) {
	var comment = Alloy.createModel('Comment');
	var params = {
		photo_id : currentPhoto.id,
		content : _content,
	    user: Alloy.Globals.user,
		allow_duplicate : 1
	};

	comment.save(params, {
		success : function(_model, _response) {
			Ti.API.info('success: ' + JSON.stringify(_model));
			var row = Alloy.createController("commentRow", _model);

			// add the controller view, which is a row to the table
			if ($.commentTable.getData().length === 0) {
				$.commentTable.setData([]);
				$.commentTable.appendRow(row.getView(), true);
			} else {
				$.commentTable.insertRowBefore(0, row.getView(), true);
			}
		},
		error : function(e) {
			Ti.API.error('error: ' + e.message);
			alert('Error saving new comment ' + e.message);
		}
	});
};

var params = {
	photo_id : currentPhoto.id,
	order : '-created_at',
	per_page : 100
};

function loadComments(_photo_id) {
	var rows = [];

	comments.fetch({
		data : params,
		success : function(model, response) {
			comments.each(function(comment) {
				var commentRow = Alloy.createController("commentRow", comment);
				rows.push(commentRow.getView());
			});
			// set the table rows
			$.commentTable.data = rows;
		},
		error : function(error) {
			alert('Error loading comments ' + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}

function handleDeleteRow(_event) {
  var collection = Alloy.Collections.instance("Comment");
  var model = collection.get(_event.row.comment_id);

  if (!model) {
    alert("Could not find selected comment");
    return;
  } else {
    deleteComment(model);
  }
}

function deleteComment(_comment) {
  _comment.destroy({
    data : {
      photo_id : currentPhoto.id, // comment on
      id : _comment.id // id of the comment object
    },
    success : function(_model, _response) {
      loadComments(null);
    },
    error : function(_e) {
      Ti.API.error('error: ' + _e.message);
      alert("Error deleting comment");
      loadComments(null);
    }
  });
}

function doOpen() {
	if (OS_ANDROID) {
		// create action bar
	}
}

$.initialize = function() {
	loadComments();
};

