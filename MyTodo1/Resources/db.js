// Database management; first version using non-persistent arrays to hold data.
// DB API
// selectItems(isDone): returns itemlist from todoData (isDone==false) or doneData (isDone==true) array.
//    Itemlist entry:  {id: <position in list> item: <string data>}
// addItem(value):  adds value to end of todoData array
// deleteItem(id, isDone): deletes the item at position id from 
//    todoData (isDone==false) or doneData (isDone==true) array. 
// updateItem(id):  moves item at position id from todoData to doneData
 
var doneData = ["Build Titanium app"];
var todoData = ["Buy groceries", "Cook dinner", "Sleep", "Take out garbage"]; 

var mkDb = function(l) {
	var ans = [];
	for (var i = 0; i < l.length; i++) {
		ans.push({id: i, item: l[i]});
	}
	return ans;
}; 

var db = { 
	selectItems: function(done) {
		return mkDb((done)?doneData:todoData);
	},
	addItem: function(value) {
		todoData.push(value);
	},
	deleteItem: function(id, isDone) {
		var list = (isDone) ? doneData : todoData;
		var item = list[id];
		list.splice(id, 1);
		return item;
	},
	updateItem: function(id) {
		var item = db.deleteItem(id, false);
		doneData.push(item);
	}
};


exports = db;