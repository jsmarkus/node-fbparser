var stream = require('stream');
var util = require('util');

var htmlparser = require('htmlparser2');

var markup = require('./markup');

function FBStream() {

    stream.Transform.call(this, {
        objectMode: true
    });

    this.stack = [];
    this.sectionDepth = 0;
    this.currentBlock = null;
    this.currentBlock = null;

    this._parser = new htmlparser.Parser({
        onopentag: this._onXMLOpen.bind(this),
        ontext: this._onXMLText.bind(this),
        onclosetag: this._onXMLClose.bind(this)
    });
}

util.inherits(FBStream, stream.Transform);

FBStream.prototype.tail = function() {
    var tags = arguments;
    for (var i = tags.length - 1, j = this.stack.length - 1; i >= 0; i--, j--) {
        if (j < 0) {
            return false;
        }
        if (tags[i] !== this.stack[j]) {
            return false;
        }
    }
    return true;
};

FBStream.prototype._onXMLOpen = function(tag, attrs) {
    this.stack.push(tag);
    if (this.tail('section')) {
        this.sectionDepth++;
    }

    if (this.tail('title', 'p')) {
        this.currentBlock = new markup.Title(this.sectionDepth);
    } else if (this.tail('p')) {
        this.currentBlock = new markup.Paragraph();
    } else if(this.tail('v')) {
        this.currentBlock = new markup.Verse();
    }
};

FBStream.prototype._onXMLText = function(value) {
    if (this.tail('emphasis')) {
        return this.currentBlock.add(new markup.Emphasis(value));
    }

    if (this.tail('strong')) {
        return this.currentBlock.add(new markup.Strong(value));
    }

    if (this.tail('p')) {
        return this.currentBlock.add(new markup.Text(value));
    }

    if (this.tail('v')) {
        return this.currentBlock.add(new markup.Text(value));
    }
};

FBStream.prototype._onXMLClose = function(tag) {
    if (this.tail('section')) {
        this.sectionDepth--;
    }
    if (this.tail('p') || this.tail('v')) {
        this.push(this.currentBlock);
        this.currentBlock = null;
    }
    this.stack.pop();
};

FBStream.prototype._transform = function(chunk, encoding, done) {
    this._parser.write(chunk);
    done(null);
};

FBStream.prototype._flush = function() {
    this._parser.end();
    this.push(null);
};

module.exports = FBStream;

module.exports.toHTML = require('./html');
module.exports.toMarkdown = require('./markdown');

//-------------------------------------