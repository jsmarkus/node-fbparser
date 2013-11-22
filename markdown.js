var stream = require('stream');
var util = require('util');

function MDStream() {
    stream.Transform.call(this, {
        objectMode: true
    });

};

util.inherits(MDStream, stream.Transform);

MDStream.prototype._transform = function(chunk, encoding, done) {
    // console.log(chunk);
    if(chunk.type === 'p') {
        this._pushPara(chunk);
    } else if(chunk.type === 'h') {
        this._pushTitle(chunk);
    }
    done(null);
};

MDStream.prototype._pushPara = function(chunk) {
    this.push(markupToString(chunk.children) + '\n');
}
MDStream.prototype._pushTitle = function(chunk) {
    var symbols = [];
    for(var i = 0; i < chunk.level + 1; i++) {
        symbols.push('#')
    }
    this.push(symbols.join('') + markupToString(chunk.children)  + '\n');
}

MDStream.prototype._flush = function() {
    // this._parser.end();
    this.push(null);
};

module.exports = MDStream;

function markupToString(elements) {
    return elements.map(function (el) {
        if(el.type === 'text') {
            return el.value;
        }
        if(el.type === 'em') {
            return '*' + el.text + '*';
        }
        if(el.type === 'strong') {
            return '**' + el.text + '**';
        }
    })
    .join('');
}