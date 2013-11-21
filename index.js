var htmlparser = require("htmlparser2");

var make = {
	para: function(text) {
		return ['para', [text + '']];
	},
	head: function(text, level) {
		return ['head', {
			level: level
		}, [text + '']];
	}
};

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
		if(tail('section')) {
			sectionDepth++;
		}
	}

	function text(value) {
		// console.log(stack)
		if(tail('title', 'p')) {
			return push(make.head(value, sectionDepth));
		}
		if(tail('p')) {
			// console.log('m');
			return push(make.para(value));
		}
	}

	function close(tag) {
		if(tail('section')) {
			sectionDepth--;
		}
		stack.pop();
	}

	var stack = [];
	var sectionDepth = 0;

	var parser = new htmlparser.Parser({
		onopentag: open,
		ontext: text,
		onclosetag: close
	});

	parser.write(xml);
	parser.end();
}

exports.parse = parse;