var htmlparser = require('htmlparser2');


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

// var make = {
//  para: function(text) {
//      return ['para', [text + '']];
//  },
//  head: function(text, level) {
//      return ['head', {
//          level: level
//      }, [text + '']];
//  }
// };

function parse(xml, push, end) {

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
        if (tail('title p')) {
            currentParagraph = new Title(sectionDepth);
        }
        if (tail('p')) {
            currentParagraph = new Paragraph();
        }
    }

    function text(value) {
        if (tail('emphasis')) {
            currentParagraph.add(new Emphasis(value));
        }
        if (tail('strong')) {
            currentParagraph.add(new Strong(value));
        }
        if (tail('p')) {
            currentParagraph.add(new Text(value));
        }
        // // console.log(stack)
        // if(tail('title', 'p')) {
        //  return push(make.head(value, sectionDepth));
        // }
        // if(tail('p')) {
        //  // console.log('m');
        //  return push(make.para(value));
        // }
    }

    function close(tag) {
        if (tail('section')) {
            sectionDepth--;
        }
        if (tail('p')) {
            push(currentParagraph);
            currentParagraph = null;
        }
        stack.pop();
    }

    var stack = [];
    var sectionDepth = 0;
    var currentParagraph = null;

    var parser = new htmlparser.Parser({
        onopentag: open,
        ontext: text,
        onclosetag: close
    });

    parser.write(xml);
    parser.end();
}

exports.parse = parse;