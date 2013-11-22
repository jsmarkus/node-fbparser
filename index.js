var stream = require('stream');
var util = require('util');
var htmlparser = require('htmlparser2');

function FBStream() {
    stream.Transform.call(this, {
        objectMode: true
    });

    var self = this;

    function tail() {
        var tags = arguments;
        for (var i = tags.length - 1, j = stack.length - 1; i >= 0; i--, j--) {
            if (j < 0) {
                return false;
            }
            if (tags[i] !== stack[j]) {
                return false;
            }
        }
        return true;
    }

    function open(tag, attrs) {
        stack.push(tag);
        if (tail('section')) {
            sectionDepth++;
        }
        if (tail('title', 'p')) {
            currentParagraph = new Title(sectionDepth);
        } else if (tail('p')) {
            currentParagraph = new Paragraph();
        }
    }

    function text(value) {
        if (tail('emphasis')) {
            return currentParagraph.add(new Emphasis(value));
        }

        if (tail('strong')) {
            return currentParagraph.add(new Strong(value));
        }

        if (tail('p')) {
            return currentParagraph.add(new Text(value));
        }
    }

    function close(tag) {
        if (tail('section')) {
            sectionDepth--;
        }
        if (tail('p')) {
            self.push(currentParagraph);
            currentParagraph = null;
        }
        stack.pop();
    }

    var stack = [];
    var sectionDepth = 0;
    var currentParagraph = null;

    var parser = this._parser = new htmlparser.Parser({
        onopentag: open,
        ontext: text,
        onclosetag: close
    });
}

util.inherits(FBStream, stream.Transform);

FBStream.prototype._transform = function(chunk, encoding, done) {
    this._parser.write(chunk);
    done(null);
};

FBStream.prototype._flush = function() {
    this._parser.end();
    this.push(null);
};

exports.Stream = FBStream;

//-------------------------------------

function Text(value) {
    this.type = 'text';
    this.value = value;
}

function Emphasis(value) {
    this.type = 'em';
    this.value = value;
}

function Strong(value) {
    this.type = 'strong';
    this.value = value;
}

function Paragraph() {
    this.type = 'p';
    this.children = [];
}

Paragraph.prototype.add = function(node) {
    this.children.push(node);
};

function Title(level) {
    this.type = 'h';
    this.level = level;
    this.children = [];
}

Title.prototype.add = function(node) {
    this.children.push(node);
};
