var Width = Ti.Platform.displayCaps.platformWidth;
var Height = Ti.Platform.displayCaps.platformHeight;

Todo = require('/lib/Todo');
Util = require('/lib/Util');

function DetailView(title, date, todo) {
	var self = Ti.UI.createView({
		backgroundColor:'#aaa',
		bubbleParent: false,
	});
	var todo = (todo) ? todo : new Todo("", date, date);
	var label = Ti.UI.createLabel({
		text: title,
		top: 100,
		backgroundColor: 'red',
		color: 'white'
	});
	
	var tdata = [
		Ti.UI.createTableViewRow({
			id: 0,
			value: todo.description,
			name: "Description: ",
			title: "Description:"+"       "+todo.description,
		}),
		Ti.UI.createTableViewRow({
			id: 1,
			value: todo.start,
			name: "Start Time:",
			title: "Start Time:"+"       "+Util.timeFormat(todo.start)
		}),
		Ti.UI.createTableViewRow({
			id: 2,
			value: todo.end,
			name: "End Time:",
			title: "End Time:"+"       "+Util.timeFormat(todo.end)
		}),
	];
	
	var detailTable = Ti.UI.createTableView({
		top: 130,
		height: 90,
		data: tdata,
		rowHeight: 30,
		scrollable: false,
		bubbleParent: false
	});
	
	detailTable.addEventListener('click', function(e){
		var rowData = e.rowData;
		switch(rowData.id) {
		case tdata[0].id:
			Ti.App.fireEvent('enableButs', {value: false});		
			getDescription(self, tdata[0].value, function(txt) {
				if (txt == null) return;
				todo.description = txt;
				tdata[0].value = txt,
				tdata[0].title = tdata[0].name+"       "+txt;
			});
			break;
		case tdata[1].id:
			Ti.App.fireEvent('enableButs', {value: false});				
			pickTime(self, tdata[1].value, function(date) {
				todo.start = date;
				tdata[1].value = date;
				tdata[1].title = tdata[1].name+"       "+Util.timeFormat(date);
			});
			break;
		case tdata[2].id:
			Ti.App.fireEvent('enableButs', {value: false});				
			pickTime(self, tdata[2].value, function(date) {
				todo.end = date;
				tdata[2].value = date;
				tdata[2].title = tdata[2].name+"       "+Util.timeFormat(date);
			});
			break;
		}
	});
	
	self.add(label);
	self.add(detailTable);
	var me = {view: self, todo: todo};
	return me;
};

function pickTime(self, current, _cb) {
	var pickView = Ti.UI.createView({
		bottom: 0,
		height: 260,
		backgroundColor: 'black',
//  		layout: 'vertical'
	});
	var ans = current;
	var picker = Ti.UI.createPicker({
		top: 0,
		height: 200,
  		type:Ti.UI.PICKER_TYPE_TIME,
  		value:current,
	});
	picker.addEventListener('change', function(e){
		ans = e.value;
	});
	var acceptButton = Ti.UI.createButton({
		title: "Accept",
		bottom: 5,
		left:10
	});
	var cancelButton = Ti.UI.createButton({
		title: "Cancel",
		bottom: 5,
		right:10
	});
	acceptButton.addEventListener('click', function(){
		Ti.API.info("acceptButton");
		animation.top=300;
		animation.duration=1000;
		animation.addEventListener('complete', function(){
			self.remove(pickView);
			Ti.App.fireEvent('enableButs', {value: true});				
			_cb(ans);
		});
		pickView.animate(animation);
	});
	cancelButton.addEventListener('click', function(){
		Ti.API.info("acceptButton");		
		animation.top=300;
		animation.duration=1000;
		animation.addEventListener('complete', function(){
			self.remove(pickView);
			Ti.App.fireEvent('enableButs', {value: true});				
		});
		pickView.animate(animation);
	});
	pickView.add(acceptButton);
	pickView.add(cancelButton);	
	pickView.add(picker);
	Ti.API.info("cancelButton1");
	var animation = Ti.UI.createAnimation();
	animation.top=130;
	animation.duration=1000;
	self.add(pickView);
	pickView.animate(animation);
}; 

function getDescription(self, current, _cb) {
	var descView = Ti.UI.createView({
		backgroundColor: "magenta",
		top: 0,
		width: Width,
		height: 120
	});
	var text = Ti.UI.createTextArea({
		top: 0,
		value: current,
		width: Width,
		height: 90
	});
	text.addEventListener('blur', function(e) {
		Ti.API.info("blur");
		animation.top=0;
		animation.duration=1000;
		animation.addEventListener('complete', function(){
			self.remove(descView);
			Ti.App.fireEvent('enableButs', {value: true});				
			_cb(text.value);
		});
		descView.animate(animation);
	});
	cancelBut = Ti.UI.createButton({
		title: "Cancel",
		bottom: 0
	});
	cancelBut.addEventListener('click', function(){
		Ti.API.info("cancelBut-click");
		animation.top=0;
		animation.duration=1000;
		animation.addEventListener('complete', function(){
			self.remove(descView);
			Ti.App.fireEvent('enableButs', {value: true});				
			_cb(null);
		});
		descView.animate(animation);
	});
	descView.add(text);
	descView.add(cancelBut);
	self.add(descView);
	Ti.API.info("cancelBut-click-1");
	var animation = Ti.UI.createAnimation();
	animation.top=130;
	animation.duration=1000;
	animation.addEventListener('complete', function(){
		text.focus();
	});
	descView.animate(animation);
}

module.exports = DetailView;
