// file: commentInput.js
var parameters = arguments[0] || {};
var currentPhoto = parameters.photo || {};
var parentController = parameters.parentController || {};
var callbackFunction = parameters.callback || null;

OS_IOS && $.saveButton.addEventListener("click", handleButtonClicked);
OS_IOS && $.cancelButton.addEventListener("click", handleButtonClicked);

function doOpen() {
	// set focus to the text input field, but
	// use set time out to give window time to draw
	setTimeout(function() {
		$.commentContent.focus();
	}, 250);

};

function handleButtonClicked(_event) {
	// set default to false
	var returnParams = {
		success : false,
		content : null
	};

	// if saved, then set properties
	if (_event.source.id === "saveButton") {
		returnParams = {
			success : true,
			content : $.commentContent.value
		};
	}

	// return to comment.js controller to add new comment
	callbackFunction && callbackFunction(returnParams);

}
