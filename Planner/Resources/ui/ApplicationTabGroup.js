function ApplicationTabGroup(TasksWindow, CalendarWindow) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var win1 = new TasksWindow(L('tasks')),
		win2 = new CalendarWindow(L('calendar'));
	
	var tab1 = Ti.UI.createTab({
		title: L('tasks'),
		icon: '/images/notepad_2_icon&32.png',
		window: win1,
	});
	win1.containingTab = tab1;

	var tab2 = Ti.UI.createTab({
		title: L('calendar'),
		icon: '/images/calendar_2_icon&32.png',
		window: win2,
		transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT		
	});
	win2.containingTab = tab2;

	win1.tabGroup = self;
	win2.tabGroup = self;
	win1.otherTab = tab2;
	win1.otherWin = win2;
	win2.otherTab = tab1;
	win2.otherWin = win1;	
	
	self.addTab(tab1);
	self.addTab(tab2);
	
	return self;
};

module.exports = ApplicationTabGroup;
