var Util = require('lib/Util');
var db = require('lib/db');
var Todo = require('lib/Todo');

var parent;  // parent window

function DayView(d, _parent) {
	parent = _parent;
	var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

	var curr_day = d.getDay();
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	var curr_year = d.getFullYear();

	var self = Ti.UI.createView({
		backgroundColor : 'yellow',
	});

	var label = Ti.UI.createLabel({
		text : d_names[curr_day] + ", " + m_names[curr_month] + " " + curr_date + ", " + curr_year,
		color : 'yellow'
	});

	var labView = Ti.UI.createView({
		top : 0,
		height : 30,
		backgroundColor : 'blue'
	});

	var spacer = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FIXED_SPACE,
		width : 120
	});
	var flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var addButton = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.ADD,
	});
	var trashButton = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.TRASH,
		enabled : false
	});
	var editButton = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.EDIT,
		enabled : false
	});
	var doneButton = Ti.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.DONE,
		enabled : false
	});

	var toolBar = Titanium.UI.iOS.createToolbar({
		items : [addButton, flexSpace, editButton, flexSpace, trashButton, flexSpace, doneButton],
		bottom : 0,
		borderTop : true,
		borderBottom : false
	});

	var changeMode = function(nmode) {
		switch (nmode) {
			case 'reset':
				if (rowCount == 0) {
					editButton.setEnabled(false);
					trashButton.setEnabled(false);
					doneButton.setEnabled(false);
				} else if (rowCount == 1) {
					editButton.setEnabled(false);
					trashButton.setEnabled(true);
					doneButton.setEnabled(false);
				} else {
					editButton.setEnabled(true);
					trashButton.setEnabled(true);
					doneButton.setEnabled(false);
				}
				taskTable.editing = false;
				taskTable.moving = false;
				taskTable.editable = false;
				taskTable.moveable = false;
				break;
			case 'moving':
				editButton.setEnabled(false);
				trashButton.setEnabled(false);
				doneButton.setEnabled(true);
				taskTable.editing = false;
				taskTable.editable = false;
				taskTable.moveable = true;
				taskTable.moving = true;
				break;
			case 'deleting':
				editButton.setEnabled(false);
				trashButton.setEnabled(false);
				doneButton.setEnabled(true);
				taskTable.editing = true;
				taskTable.editable = true;
				taskTable.moveable = false;
				taskTable.moving = false;
				break;
		};
	};

	editButton.addEventListener('click', function() {
		changeMode('moving');
	});
	trashButton.addEventListener('click', function() {
		changeMode('deleting');
	});
	doneButton.addEventListener('click', function() {
		reorder();
		changeMode('reset');
	});

	addButton.addEventListener('click', function() {
		changeMode('reset');
		var now = new Date();
		now.setFullYear(curr_year);
		now.setMonth(curr_month);
		now.setDate(curr_date);
		openDetailWin("Add Task", now, function(detailWin, detailView) {
			return function() {
				var todo = detailView.todo;
				if (!returnCheck(todo))
					return;
				detailWin.close();
				var id = db.add(todo, rowCount);
				todo.id = id;
				addRow(todo);
				changeMode('reset');
			};
		});
	});

	var taskTable = Ti.UI.createTableView({
		top : 30,
		height : 0,
		rowHeight : 30,
		scrollable : false,
		editable : false,
		moveable : false
	});

	var rowCount = 0;

	taskTable.addEventListener('delete', function(e) {
		db.del(e.row.todo.id);
		rowCount--;
		if (rowCount < 10) {
			taskTable.height -= 30;
			taskTable.scrollable = false;
		}
		if (rowCount == 0)
			changeMode('reset');
	});

	taskTable.addEventListener('click', function(e) {
		changeMode('reset');
		var currentRow = e.rowData;
		openDetailWin("Modify Task", currentRow.start, function(detailWin, detailView) {
			return function() {
				var todo = detailView.todo;
				if (!returnCheck(todo))
					return;
				detailWin.close();
				var view = buildTableRow(todo);
				var newRow = Ti.UI.createTableViewRow({
					todo : todo,
					height : 30,
					rowIndex : currentRow.rowIndex
				});
				newRow.add(view);
				taskTable.updateRow(currentRow.rowIndex, newRow, {animationStyle:Titanium.UI.iPhone.RowAnimationStyle.FADE});
				db.update(todo);
			};
		}, e.rowData.todo);
	});

	labView.add(label);
	self.add(labView);
	self.add(taskTable);
	self.add(toolBar);

	var populate = function() {
		var rawtodos = db.daylist(d);
		for (var i in rawtodos) {
			rawtodo = rawtodos[i];
			todo = new Todo(rawtodo.description, new Date(rawtodo.start), new Date(rawtodo.end), rawtodo.id);
			addRow(todo, rawtodo.id);
		}
		changeMode('reset');
	};
	
	var addRow = function(todo) {
		var view = buildTableRow(todo);
		var tableViewRow = Ti.UI.createTableViewRow({
			todo : todo,
			height : 30,	
			rowIndex : rowCount,
		});
		tableViewRow.add(view);
		taskTable.appendRow(tableViewRow);
		if (rowCount++ < 11)
			taskTable.height += 30;
		else
			taskTable.scrollable = true;
	};

	var reorder = function() {
		var rows = taskTable.getData()[0].rows;
		var ids = [];
		for (var i in rows) {
			var row = rows[i];
			row.rowIndex = i;
			ids.push(row.todo.id);
		}
		db.reorder(ids);
	};

	populate();
	return self;
}

function buildTableRow(todo) {
	var oneShot = (todo.end.valueOf() == todo.start.valueOf());
	var rowView = Ti.UI.createView({
		height : 30,
		layout : 'horizontal'
	});
	var descLabel = Ti.UI.createLabel({
		left : 20,
		font : {
			fontSize : 9
		},
		text : todo.description,
		backgroundColor : 'white',
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		width : 130,
		height : 30
	});
	var startLabel = Ti.UI.createLabel({
		left : 5,
		font : {
			fontSize : 9
		},
		text : Util.timeFormat(todo.start),
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		backgroundColor : (oneShot) ? 'pink' : 'green',
		width : 50
	});
	rowView.add(descLabel);
	rowView.add(startLabel);
	if (oneShot)
		return rowView;
	var toLabel = Ti.UI.createLabel({
		left : 5,
		font : {
			fontSize : 9
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : "to",
		backgroundColor : 'yellow',
		width : Ti.UI.SIZE
	});
	var endLabel = Ti.UI.createLabel({
		left : 5,
		font : {
			fontSize : 9
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : Util.timeFormat(todo.end),
		backgroundColor : 'green',
		width : 50
	});
	rowView.add(toLabel);
	rowView.add(endLabel);
	return rowView;
}

function openDetailWin(title, d, _cb, todo) {
	var DetailView = require('ui/DetailView');
	var style = Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL;
	var presentation = Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN;
	var detailWin = Ti.UI.createWindow();
	var okBut = Ti.UI.createButton({
		title : "OK",
		bottom : 10,
		left : 20
	});
	var cancelBut = Ti.UI.createButton({
		title : "CANCEL",
		bottom : 10,
		right : 20
	});
	var enable = function(b) {
		okBut.setEnabled(b.value);
		cancelBut.setEnabled(b.value);
	};
	Ti.App.addEventListener('enableButs', enable);
	var detailView = new DetailView(title, d, todo);
	okBut.addEventListener('click', function(e) {
		_cb(detailWin, detailView)(e);
		Ti.App.removeEventListener('enableButs', enable);
	});
	cancelBut.addEventListener('click', function() {
		detailWin.close();
		Ti.App.removeEventListener('enableButs', enable);
	});
	detailWin.add(detailView.view);
	detailWin.add(okBut);
	detailWin.add(cancelBut);
	parent.containingTab.open(detailWin, {
		modal : true,
		modalTransitionStyle : style,
		modalStyle : presentation,
		navBarHidden : true
	});
}

function returnCheck(todo) {
	if (todo.description == "") {
		alert("You must enter a description for this task");
		return false;
	}
	if (todo.end.getTime() < todo.start.getTime()) {
		alert("Start time must preceed or equal end time");
		return false;
	}
	return true;
}

module.exports = DayView;
