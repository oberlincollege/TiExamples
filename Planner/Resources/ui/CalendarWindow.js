var Width = Ti.Platform.displayCaps.platformWidth;
var Height = Ti.Platform.displayCaps.platformHeight;
var CalView = require('ui/CalendarView');

function CalendarWindow(title) {
	//create component instance
	var self = Ti.UI.createWindow({
		title: title,
		backgroundColor:'#ffffff',
	});

	//construct UI

	self.addEventListener('swipe', function(e) {
		if (e.direction == 'up' || e.direction == 'down') return;
		var showdate = newDate(Ti.App.Properties.getObject('showdate'), e.direction);
		Ti.App.Properties.setObject('showdate', showdate);
		var seldate = Ti.App.Properties.getObject('seldate');
		var newCalView = CalView(showdate, seldate, callBack);
		self.remove(calView);
		self.add(newCalView);
		calView = newCalView;
		if (e.direction == 'left') {
			newCalView.left = Width-5;
			newCalView.animate({duration: 500, left:0});
		} else {
			newCalView.right = Width-5;
			newCalView.animate({duration: 500, right:0});
		}	
	});

	var callBack = function(newSeldate){
		Ti.App.Properties.setObject('seldate', newSeldate);
		Ti.API.fireEvent('setTaskDate', {date: newSeldate});
		self.tabGroup.setActiveTab(self.otherTab);
	};

	var showdate = Ti.App.Properties.getObject('showdate');
	var calView = CalView(showdate, showdate, callBack);
	self.add(calView);
	
	return self;
}

function newDate(d, dir) {
	var dim = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (curr_year % 4 == 0 && (curr_year % 100 != 0 || curr_year % 400 == 0)) dim[1]++;
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	var curr_date = new Date().getDate();
	curr_month  = curr_month + ((dir == "left") ? 1 : (dir == "right") ? -1 : 0);
	if (curr_month < 0) {
		curr_month = 11;
		curr_year--;
	} else if (curr_month > 11) {
		curr_month = 0;
		curr_year++;
	}
	var ndate = new Date(curr_year, curr_month, curr_date);
	return ndate;
};

//make constructor function the public component interface
module.exports = CalendarWindow;
