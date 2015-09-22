var platform = Ti.Platform.osname;

function ApplicationWindow(title) {

	var isDone = title == L('done');
	var AddWindow = require("ui/AddWindow").AddWindow;
	
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});

	var tableview = Ti.UI.createTableView();
	tableview.setData(getTableData(isDone));
	
	if (!isDone) {
		var addBtn = Ti.UI.createButton({
			title:'+'
		});
		addBtn.addEventListener('click', function() {
			new AddWindow().open();
		});
		if (platform === 'mobileweb') {
			self.layout = 'vertical';
			addBtn.height = 40;
			addBtn.width = 40;
			addBtn.top = 0;
				addBtn.right = 10;
			self.add(addBtn);
			self.add(tableview);
		} else{
			self.rightNavButton = addBtn;
		}
	}	
	
	Ti.App.addEventListener('app:updateTables', function() {
		tableview.setData(getTableData(isDone));
	});

	tableview.addEventListener('click', function(e) {
		createConfirmDialog(e.row.id, e.row.title, isDone).show();
	});

	self.add(tableview);

	return self;
};


// uses temporary db;  see db.js for API details

var getTableData = function(done) {
	var db = require("db"); 	
	var data = [];
	var row = null;
	var todoItems = db.selectItems(done);
	for (var i = 0; i < todoItems.length; i++) {
		row = Ti.UI.createTableViewRow({
			id: todoItems[i].id,
			title: todoItems[i].item,
			color: '#000',
			font: {
				fontWeight: 'bold'
			}
		});
		data.push(row);
	}
	return data;
};

module.exports = ApplicationWindow;

// Moving/Deleting

var createConfirmDialog = function(id, title, isDone) {
	var db = require('db');
	var buttons, doneIndex, clickHandler;

	if (isDone) {
		buttons = ['Delete', 'Cancel'];
		clickHandler = function(e) {
			if (e.index === 0) {
				deleteItem(db, id, isDone);
				Ti.App.fireEvent('app:updateTables');
			}
		};
	} else {
		buttons = ['Done', 'Delete', 'Cancel'];
		clickHandler = function(e) {
			if (e.index === 0) {
				db.updateItem(id, 1);
				Ti.App.fireEvent('app:updateTables');
			} else if (e.index === 1) {
				deleteItem(db, id, isDone);
				Ti.App.fireEvent('app:updateTables');
			}
		};
	}

	var confirm = Ti.UI.createAlertDialog({
		title: 'Change Task Status',
		message: title,
		buttonNames: buttons
	});
	confirm.addEventListener('click', clickHandler);

	return confirm;
};

var deleteItem = function(db, id, isDone) {
	db.deleteItem(id, isDone);
};