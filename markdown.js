var stream = require('stream');
var util = require('util');

function MDStream() {
    stream.Transform.call(this, {
        objectMode: true
    });

};

util.inherits(MDStream, stream.Transform);

MDStream.prototype._transform = function(chunk, encoding, done) {
    if (chunk.type === 'p') {
        this._pushPara(chunk);
    } else if (chunk.type === 'v') {
        this._pushVerse(chunk);
    } else if (chunk.type === 'h') {
        this._pushTitle(chunk);
    } else if (chunk.type === 'subtitle') {
        this._pushPara(chunk); //really, it is just a normal paragraph
    } else if (chunk.type === 'text-author') {
        this._pushSubtitle(chunk);
    }
    done(null);
};

MDStream.prototype._pushVerse = function(chunk) {
    this.push(markupToString(chunk.children) + '\n\n');
};

MDStream.prototype._pushPara = function(chunk) {
    this.push(markupToString(chunk.children) + '\n\n');
};

MDStream.prototype._pushTitle = function(chunk) {
    var symbols = [];
    for (var i = 0; i < chunk.level + 1; i++) {
        symbols.push('#');
    }
    this.push(symbols.join('') + ' ' + markupToString(chunk.children) + '\n\n');
};

MDStream.prototype._pushSubtitle = function(chunk) {
    this.push('**' + markupToString(chunk.children) + '**\n\n');
};

MDStream.prototype._flush = function() {
    this.push(null);
};

module.exports = MDStream;

function markupToString(elements) {
    return elements.map(function(el) {
        if (el.type === 'text' || el.type === 'style') {
            return el.value;
        }
        if (el.type === 'em') {
            return '*' + el.value + '*';
        }
        if (el.type === 'strong') {
            return '**' + el.value + '**';
        }
    })
        .join('');
}