require('zepto/zepto.min');

var fb2 = require('./index');

var stream = new fb2();
var html = new fb2.toHTML();
stream.pipe(html);

stream.on('data', function(chunk) {
    console.log(chunk);
});

stream.on('end', function() {
    console.log('end');
});

var raw = [];

html.on('data', function (chunk) {
    raw.push(chunk);
});

html.on('end', function (chunk) {
    document.body.innerHTML= raw.join('');
});

$.get('fixtures/gribuser.fb2', function (text) {
    stream.write(text);
    stream.end();
});
