var util = require('util');

//------------------------------------------

function Text(value) {
    this.type = 'text';
    this.value = value;
}

//------------------------------------------

function Emphasis(value) {
    this.type = 'em';
    this.value = value;
}

//------------------------------------------

function Strong(value) {
    this.type = 'strong';
    this.value = value;
}

//------------------------------------------

function Style(value) {
    this.type = 'style';
    this.value = value;
}

//------------------------------------------
//------------------------------------------
//------------------------------------------
//------------------------------------------

function Block() {
    this.children = [];
}

Block.prototype.add = function(node) {
    this.children.push(node);
};

//------------------------------------------

function Paragraph() {
    this.type = 'p';
    Block.call(this);
}

util.inherits(Paragraph, Block);

//------------------------------------------
function TextAuthor() {
    this.type = 'text-author';
    Block.call(this);
}

util.inherits(TextAuthor, Block);

//------------------------------------------
function Subtitle() {
    this.type = 'subtitle';
    Block.call(this);
}

util.inherits(Subtitle, Block);

//------------------------------------------

function Title(level) {
    this.type = 'h';
    this.level = level;
    Block.call(this);
}

util.inherits(Title, Block);

//------------------------------------------

function Verse() {
    this.type = 'v';
    Block.call(this);
}

util.inherits(Verse, Block);

//------------------------------------------

module.exports = {
    Text: Text,
    Paragraph: Paragraph,
    TextAuthor: TextAuthor,
    Emphasis: Emphasis,
    Title: Title,
    Strong: Strong,
    Style: Style,
    Verse: Verse
};