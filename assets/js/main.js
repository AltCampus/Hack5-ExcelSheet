
displayCells();

function displayCells() {
	var cellSection = document.querySelector('.cell-section');
	var cellContent = "";
	var id = "";

	for (let i = 0;i<40;i++){
		cellContent += `<div class="row">`
		for (let j = 0; j < 26; j++) {
			if (j == 0) { cellContent += `<div class="row-headers">${i}</div>`; continue; }
			if (i == 0) { cellContent += `<div class="column-headers">${String.fromCharCode(j + 65-1)}</div>`; continue; }
			id = String.fromCharCode(j + 65-1) + (i);
			cellContent += `<input type="text" value='${localStorage[id] ? localStorage[id] : "" }' id="${id}"> `
		}
		cellContent += `</div>`
	}
	cellSection.innerHTML = cellContent;
}

var DATA = {};
var inputsNode = [].slice.call(document.querySelectorAll("input"));

inputsNode.forEach(function (elm) {
	elm.onfocus = function (e) {
		e.target.value = localStorage[e.target.id] || "";
	};
	elm.onblur = function (e) {
		localStorage[e.target.id] = e.target.value;
		computeAll(e);
	};
});

function computeAll(e) {
	var value = localStorage[e.target.id] || "";
	if (value.charAt(0) == "=") {
		value = value.substring(1);
		var re = /[A-Z][0-9]/g;
		var m;
		var mArray = [];
		do {
			m = re.exec(value);
			mArray.push(m);
		} while (m);
		console.log(mArray);
		evaluate(value, mArray,e)
	}
}

function evaluate(str, arrVar,e) {
	var newStr = ``;
	// console.log(arrVar);
	for (i = 0; i < str.length; i++) {
		let flag = 0;
		for (j = 0; j < arrVar.length - 1; j++) {
			if (arrVar[j].index == i) {
				newStr += `${localStorage[arrVar[j][0]]}`;
				i += arrVar[j][0].length-1;
				flag = 1;
				break;
			}
		}
		if (flag == 1) {
			continue;
		}
		else newStr += str[i];
	}
	e.target.value = calculate(newStr);
}

function calculate(input) {

	var f = {
		add: '+',
		sub: '-',
		div: '/',
		mlt: '*',
		mod: '%',
		exp: '^'
	};

	f.ooo = [
		[
			[f.mlt],
			[f.div],
			[f.mod],
			[f.exp]
		],
		[
			[f.add],
			[f.sub]
		]
	];

	input = input.replace(/[^0-9%^*\/()\-+.]/g, '');

	var output;
	for (var i = 0, n = f.ooo.length; i < n; i++) {

		var re = new RegExp('(\\d+\\.?\\d*)([\\' + f.ooo[i].join('\\') + '])(\\d+\\.?\\d*)');
		re.lastIndex = 0; 

		while (re.test(input)) {
			output = _calculate(RegExp.$1, RegExp.$2, RegExp.$3);
			if (isNaN(output) || !isFinite(output))
				return output;
			input = input.replace(re, output);
		}
	}

	return output;

	function _calculate(a, op, b) {
		a = a * 1;
		b = b * 1;
		switch (op) {
			case f.add:
				return a + b;
				break;
			case f.sub:
				return a - b;
				break;
			case f.div:
				return a / b;
				break;
			case f.mlt:
				return a * b;
				break;
			case f.mod:
				return a % b;
				break;
			case f.exp:
				return Math.pow(a, b);
				break;
			default:
				null;
		}
	}
}
