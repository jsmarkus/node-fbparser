var stream = require('stream');
var util = require('util');

function HTMLStream() {
    stream.Transform.call(this, {
        objectMode: true
    });

};

util.inherits(HTMLStream, stream.Transform);

HTMLStream.prototype._transform = function(chunk, encoding, done) {
    if (chunk.type === 'p') {
        this._pushPara(chunk);
    } else if (chunk.type === 'h') {
        this._pushTitle(chunk);
    } else if (chunk.type === 'v') {
        this._pushVerse(chunk);
    }
    done(null);
};

HTMLStream.prototype._pushPara = function(chunk) {
    this.push('<p>' + markupToString(chunk.children) + '</p>\n');
};

HTMLStream.prototype._pushVerse = function(chunk) {
    this.push('<p class="verse">' + markupToString(chunk.children) + '</p>\n');
};

HTMLStream.prototype._pushTitle = function(chunk) {
    var level = chunk.level + 1;
    if (level > 6) {
        level = 6;
    }
    this.push('<h' + level + '>' + markupToString(chunk.children) + '</h' + level + '>\n');
};

HTMLStream.prototype._flush = function() {
    this.push(null);
};

module.exports = HTMLStream;

function markupToString(elements) {
    return elements.map(function(el) {
        if (el.type === 'text') {
            return el.value;
        }
        if (el.type === 'em') {
            return '<em>' + el.value + '</em>';
        }
        if (el.type === 'strong') {
            return '<strong>' + el.value + '</strong>';
        }
    }).join('');
};