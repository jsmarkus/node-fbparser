var fb2 = require('./index');
var fs = require('fs');

var mdStream = fs
    .createReadStream('fixtures/gribuser.fb2')
    .pipe(new fb2())
    .pipe(new fb2.toHTML());

mdStream.on('data', function(chunk) {
    console.log(chunk);
});

mdStream.on('end', function() {
    console.log('end');
});