// when we start up, create a user and log in
var user = Alloy.createModel('User');

// $.userLoggedInAction = function() {
    // user.showMe(function(_response) {
        // if (_response.success === true) {
            // $.loginSuccessAction(_response);
        // } else {
            // alert("Application Error\n " +_response.error.message);
            // Ti.API.error(JSON.stringify(_response.error, null, 2));
// 
            // // go ahead and do the login
            // $.userNotLoggedInAction();
        // }
    // });    
// };
// 
// $.loginSuccessAction = function(_options) {
// 
    // Ti.API.info('logged in user information');
    // Ti.API.info(JSON.stringify(_options.model, null, 2));
// 
    // // open the main screen
    // $.tabGroup.open();
//     
    // // set tabGroup to initial tab, in case this is coming from
    // // a previously logged in state
    // $.tabGroup.setActiveTab(0);
// 
    // // pre-populate the feed with recent photos
    // $.feedController.initialize();
// 
    // // get the current user
    // Alloy.Globals.currentUser = _options.model;
// 
    // // set the parent controller for all of the tabs, give us
    // // access to the global tab group and misc functionality
    // $.feedController.parentController = $;
    // $.friendsController.parentController = $;
    // $.settingsController.parentController = $;
// 
    // // do any necessary cleanup in login controller
    // $.loginController && $.loginController.close();
// };
// 
// $.userNotLoggedInAction = function() {
// 
    // // open the login controller to login the user
    // if (!$.loginController) {
        // var loginController = Alloy.createController("login", {
            // parentController : $,
            // reset : true
        // });
// 
// 
        // // save controller so we know not to create one again
        // $.loginController = loginController;
    // }
// 
// 
    // // open the window
    // $.loginController.open(true);
// 
// };

user.login("rms", "oberlin", function(_response) {
	Ti.API.debug("login "+JSON.stringify(_response));
	Alloy.Globals.user = _response.model;
   if (_response.success) {
      // open the main screen
      $.tabGroup.open();
      
   // pre-populate the feed with recent photos
	  $.feedController.initialize();

   } else {
      alert("Error Starting Application " + _response.error);
      Ti.API.error('error logging in ' + _response.error);
   }
});

//if (user.authenticated() === true) {
//    $.userLoggedInAction();
//} else {
//   $.userNotLoggedInAction();
//}

Alloy.Globals.openCurrentTabWindow = function(_window) {
	$.tabGroup.activeTab.open(_window);
};
