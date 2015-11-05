// db.js 
// planner database
// Author:  R. M. Salter

// DB table fields:
// id (internal key, used only to pinpoint specific db records for update and deletion),
// date (integer field used as key for retrieving all records from a particular date),
// desc (text description0), 
// start, end (JS dates stored as numbers), 
// sort (used to order retrieve records based on current table sort)

var db = Ti.Database.open('Todos');
db.execute('CREATE TABLE IF NOT EXISTS todos(id INTEGER PRIMARY KEY AUTOINCREMENT, date INTEGER, desc TEXT, start REAL, end REAL, sort INTEGER);');
db.close();

// returns an array of objects keyed to the JS _date parameter/
// each contains all fields from the db record

exports.daylist = function(_date) {
	var todos = [];
	var db = Ti.Database.open('Todos');
	var result = db.execute('SELECT * FROM todos WHERE date = ? ORDER BY sort', toDateValue(_date));
	while (result.isValidRow()) {
		todos.push({
			//add these attributes for the benefit of a table view
			description: result.fieldByName('desc'),
			id: result.fieldByName('id'), // You'll need this property to delete and update the DB
			start: result.fieldByName('start'),
			end: result.fieldByName('end'),
			date: result.fieldByName('date'),
			sort: result.fieldByName('sort')
		});
		result.next();
	}
	result.close();
	db.close();
	return todos;
};

// adds a new object at a particular sort position
// todo is a JS object containing description, start, and end properties

exports.add = function(todo, sort) {
	var db = Ti.Database.open('Todos');
	db.execute("INSERT INTO todos(date, desc, start, end, sort) VALUES(?,?,?,?,?)", toDateValue(todo.start), todo.description, todo.start.valueOf(), todo.end.valueOf(), sort);
	var n = db.lastInsertRowId;
	db.close();
	Ti.App.fireEvent("databaseUpdated");
	return n;		
};

// deletes the record with the given id

exports.del = function(id) {
	var db = Ti.Database.open('Todos');
	db.execute('DELETE FROM todos WHERE id = ?', id);	
	db.close();
	Ti.App.fireEvent("databaseUpdated");
};

// updates the database using the todo object parameter
// todo object contains description, start, end, and id properties

exports.update = function(todo) {
	var db = Ti.Database.open('Todos');
	db.execute('UPDATE todos SET desc=?, start=?, end=? WHERE id = ?', todo.description, todo.start.valueOf(), todo.end.valueOf(), todo.id);	
	db.close();
	Ti.App.fireEvent("databaseUpdated");
};

// ids is an array of id values in the desired sorted order
// reorder sets the sort field of the corresponding records
// this function is used when a task table has be edited

exports.reorder = function(ids) {
	var db = Ti.Database.open('Todos');	
	for (var key in ids) {
		id = ids[key];
		db.execute('UPDATE todos SET sort=? WHERE id = ?', key, id);
	}
	db.close();
	Ti.App.fireEvent("databaseUpdated");	
};

// help function to translate a JS date to a unique integer

function toDateValue(date) {
	var year = String(date.getFullYear());
	var month = String(date.getMonth());
	var date = String(date.getDate());
	if (month.length < 2) month = "0"+month;
	if (date.length < 2) date = "0"+date;
	return Number(year+month+date);
};
