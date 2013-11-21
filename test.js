var fb2 = require('./index');
var fs = require('fs');

// var xml = fs.readFileSync('1.u.fb2', 'utf8');
var xml = fs.readFileSync('test.u.fb2', 'utf8');

fb2.parse(xml, function (item) {
	console.log(item);
});