// CalendarView
// Author:  R. M. Salter et.al.

var screenWidth = Ti.Platform.displayCaps.platformWidth;

// exported function CalendarView returns a new monthly view
// dis_date is the date whose year and month are to be displayed; sel_date is currently selected JS date
// _cb is a callback function that is invoked on the new selected JS date when one is selected  

function CalendarView(dis_date, sel_date, _cb) {
	// break down display date -- only need month and year
	var dyr = dis_date.getFullYear(), dmo = dis_date.getMonth();
	// break down selected date
	var syr = sel_date.getFullYear(), smo = sel_date.getMonth(), sda = sel_date.getDate();
	// what's today's date?
	today = new Date();
	// break down today
	var tyr = today.getFullYear(), tmo = today.getMonth(), tda = today.getDate();
	var toolBar = makeToolBar(dyr, dmo);
	var cal = calendar(dyr, dmo, syr, smo, sda, tyr, tmo, tda, _cb);
	// Main View of the Month View.
	var self = Ti.UI.createView({layout: 'vertical'});
	self.add(toolBar);
	self.add(cal);
	
	Ti.API.addEventListener('setCalDate', function(e) {
		if (sameDate(dis_date, e.date) && sameDate(sel_date, e.date)) return;
		sel_date = e.date;
		dis_date = e.date;
		// break down selected date
		var syr = sel_date.getFullYear(), smo = sel_date.getMonth(), sda = sel_date.getDate();
		toolBar = makeToolBar(syr, smo);		
		cal = calendar(syr, smo, syr, smo, sda, tyr, tmo, tda, _cb);
		self.removeAllChildren();
		self.add(toolBar);
		self.add(cal);
	});
	return self;
}

// Help function to identify to JS dates that represent the same real date

function sameDate(d0, d1) {
	return d0.getFullYear() == d1.getFullYear() 
		&& d0.getMonth() == d1.getMonth()
		&& d0.getDate() == d1.getDate();
}

// Builds the toolbar for a give year and month

function makeToolBar(yr, mo) {
	// Tool Bar
	var toolBar = Ti.UI.createView({
		width : screenWidth,
		height : 50,
		backgroundColor : '#FFFFD800',
		layout : 'vertical'
	});
	// Tool Bar Title
	var toolBarTitle = Ti.UI.createView({
		top : '3dp',
		width : '322dp',
		height : '24dp'
	});
	// Month Title - Tool Bar
	var monthTitle = Ti.UI.createLabel({
		width : 200,
		height : 24,
		text: monthName[mo]+' '+yr,
		textAlign : 'center',
		color : '#3a4756',
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		}
	});
	toolBarTitle.add(monthTitle);
	// Tool Bar Day
	var toolBarDays = Ti.UI.createView({
		top : 2,
		width : 322,
		height : 22,
		layout : 'horizontal',
		left : 0
	});
	var dayLabel = function(daytxt) {
		return Ti.UI.createLabel({
			left : '0dp',
			height : '20dp',
			text : daytxt,
			width : '46dp',
			textAlign : 'center',
			font : {
				fontSize : 12,
				fontWeight : 'bold'
			},
			color : '#3a4756'
		});
	};
	for (var i in dayOfWeek) toolBarDays.add(dayLabel(dayOfWeek[i]));
	// Adding Tool Bar Title View & Tool Bar Days View
	toolBar.add(toolBarTitle);
	toolBar.add(toolBarDays);
	return toolBar;
}

// Builds the calendar for a given year and month (yr and mo)
// syr, smo and sda are the selected year, month and day
// tyr, tmo and tda are today
// _cb is the callback applied to the new selected date when one is selected

var calendar = function(yr, mo, syr, smo, sda, tyr, tmo, tda, _cb) {
	// yr,mo,da are selected day; tyr,tmo,tda are today
	//create main calendar view
	var mainView = Ti.UI.createView({
		layout : 'horizontal',
		width : 322,
		height : 'auto',
		cb : _cb
	});
	// determine the cal data
	var isCurrentMonth = (yr == tyr && mo == tmo);
	var isSelectedMonth = (yr == syr && mo == smo);
	var daysInMonth = 32 - new Date(yr, mo, 32).getDate();
	var dayOfMonthToday = tda;
	var dayOfWeek = new Date(yr, mo, 1).getDay();
	var daysInLastMonth = 32 - new Date(yr, mo-1, 32).getDate();
	var daysInNextMonth = (new Date(yr, mo, daysInMonth).getDay()) - 6;
	//set initial day of week number
	var dayNumber = daysInLastMonth - dayOfWeek + 1;
	//get last month's days
	for ( i = 0; i < dayOfWeek; i++) {
		mainView.add(new dayView({
			day : dayNumber,
			color : '#8e959f',
			current : 'no',
		}));
		dayNumber++;
	};
	// reset day number for current month
	dayNumber = 1;
	//get this month's days
	var oldDay = {};
	for ( i = 0; i < daysInMonth; i++) { 
		var newDay = new dayView({ 
			day : dayNumber, 
			color : '#3a4756', 
			current : 'yes', 
		}); 
		mainView.add(newDay);
		// if this day is today, show it
		if (isCurrentMonth && tda == dayNumber) {
			newDay.color = 'white'; 
			newDay.backgroundColor = '#FFFFF000';
			oldDay = newDay; 		
		}
		// if this day is the chosen day, select it
		if (isSelectedMonth && dayNumber == sda) select(newDay);
	    dayNumber++;		
	}
	// reset day number for next month	
	dayNumber = 1;
	//get remaining month's days
	for ( i = 0; i > daysInNextMonth; i--) {
		  mainView.add(new dayView({
			 day : dayNumber,
			 color : '#8e959f',
			 current : 'no',
		  }));
	     dayNumber++;
	 }
	// day selection event listener
	mainView.addEventListener('click', function(e) {
		if (e.source.current == 'yes') {
			select(e.source);
			if (mainView.cb != null) mainView.cb(new Date(yr, mo, e.source.text));
		}
	}); 
	return mainView;

	// function to highlight selected day
	function select(dayView) {
		if (isCurrentMonth && oldDay.text == dayOfMonthToday) {
			oldDay.color = 'white';
			oldDay.backgroundColor = '#FFFFF000';
		} else {
			oldDay.color = '#3a4756';
			oldDay.backgroundColor = '#FFDCDCDF';
		}
		oldDay.backgroundPaddingLeft = 0;
		oldDay.backgroundPaddingBottom = 0;
		if (isCurrentMonth && dayView.text == dayOfMonthToday) {
			dayView.backgroundColor = '#FFFF00FF';
		} else {
			dayView.backgroundColor = '#FFFF0000';
		}
		dayView.backgroundPaddingLeft = 1;
		dayView.backgroundPaddingBottom = 1;
		dayView.color = 'white';
		oldDay = dayView;
	};
};

// creates a label for a day given an object containing date
// of month and color

function dayView(e) {
	var label = Ti.UI.createLabel({
		current : e.current,
		width : '46dp',
		height : '44dp',
		backgroundColor : '#FFDCDCDF',
		text : e.day,
		textAlign : 'center',
		color : e.color,
		font : {
			fontSize : 20,
			fontWeight : 'bold'
		}
	});
	return label;
}; 

var dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 
				 'July', 'August', 'September', 'October', 'November', 'December'];

exports = CalendarView;
