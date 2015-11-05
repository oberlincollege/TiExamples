exports.timeFormat = function(d) {
	if (d == "") return "";
	var curr_hour = d.getHours();
	a_p = (curr_hour < 12) ? "AM" : "PM";
	if (curr_hour == 0) curr_hour = 12;
	if (curr_hour > 12) curr_hour = curr_hour - 12;
	var curr_min = d.getMinutes();
	curr_min = curr_min + "";
	if (curr_min.length == 1) {
   		curr_min = "0" + curr_min;
   	}
	return curr_hour + " : " + curr_min + " " + a_p;
};

exports.toDateValue = function(date) {
	var year = String(date.getFullYear());
	var month = String(date.getMonth());
	var date = String(date.getDate());
	if (month.length < 2) month = "0"+month;
	if (date.length < 2) date = "0"+date;
	return Number(year+month+date);
};
