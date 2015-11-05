DayView = require("ui/DayView");

var Width = Ti.Platform.displayCaps.platformWidth;
var Height = Ti.Platform.displayCaps.platformHeight;

function TasksWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var curr_date = Ti.App.Properties.getObject('seldate');
	
	self.addEventListener('swipe', function(e) {
		if (e.direction == 'up' || e.direction == 'down') return;
		curr_date = newDate(curr_date, e.direction);
		Ti.App.Properties.setObject('seldate', curr_date);
		Ti.App.Properties.setObject('showdate', curr_date);
		Ti.API.fireEvent('setCalDate', {date: curr_date});
		var newDayView = DayView(curr_date, self);
		self.remove(dayView);
		self.add(newDayView);
		dayView = newDayView;
		if (e.direction == 'left') {
			newDayView.left = Width-10;
			newDayView.animate({duration: 500, left:0});
		} else {
			newDayView.right = Width-10;
			newDayView.animate({duration: 500, right:0});
		}	
	});

	Ti.API.addEventListener('setTaskDate', function(e) {
		curr_date = e.date;
		var newDayView = DayView(curr_date, self);
		self.remove(dayView);
		self.add(newDayView);
		dayView = newDayView;
	});

	self.addEventListener('focus', function() {
		Ti.App.Properties.setObject('seldate', curr_date);
		Ti.App.Properties.setObject('showdate', curr_date);
		Ti.API.fireEvent('setCalDate', {date: curr_date});
	});
	
	var dayView = DayView(curr_date, self);
	self.add(dayView);
	return self;
};

function newDate(d, dir) {
	var dim = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (curr_year % 4 == 0 && (curr_year % 100 != 0 || curr_year % 400 == 0)) dim[1]++;
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();
	curr_date  = curr_date + ((dir == "left") ? 1 : (dir == "right") ? -1 : 0);
	if (curr_date < 0) {
		curr_month--;
		curr_date = dim[curr_month];
	} else if (curr_date > dim[curr_month]){
		curr_month++;
		curr_date = 1;
	}
	if (curr_month < 0) {
		curr_month = 11;
		curr_date = dim[curr_month];
		curr_year--;
	} else if (curr_month > 11) {
		curr_month = 0;
		curr_date = 1;
		curr_year++;
	}
	var ndate = new Date(curr_year, curr_month, curr_date);
	return ndate;
};

module.exports = TasksWindow;
