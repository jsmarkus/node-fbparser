var fb2 = require('./index');
var md = require('./markdown');
var fs = require('fs');

var mdStream = fs
    .createReadStream('bible.u.fb2')
    .pipe(new fb2.Stream())
    .pipe(new md());

mdStream.on('data', function(chunk) {
    console.log(chunk);
});

mdStream.on('end', function() {
    console.log('end');
});