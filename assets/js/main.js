var startCell = 'A1';
var MainData = JSON.parse(localStorage.getItem('excel')) || {};
displayCells();

//Displaying The cells Grid
function displayCells() {
  var cellSection = document.querySelector('.cell-section');
  var cellContent = "";
  var id = "";

  for (let i = 0; i < 40; i++) {
    cellContent += `<div class="row">`
    for (let j = 0; j < 26; j++) {
      if (j == 0) {
        cellContent += `<div class="row-headers">${i}</div>`;
        continue;
      }
      if (i == 0) {
        cellContent += `<div class="column-headers">${String.fromCharCode(j + 65 - 1)}</div>`;
        continue;
      }
      id = String.fromCharCode(j + 65 - 1) + (i);
      cellContent += `<input type="text" class="cell" draggable="true" value='${(MainData[id]) ? MainData[id].value : ""}' id="${id}"> `
    }
    cellContent += `</div>`
  }
  cellSection.innerHTML = cellContent;
  addListner();
}

function addListner() {
  var inputsNode = [].slice.call(document.querySelectorAll("input"));
  inputsNode.forEach(function(elm) {
    elm.onfocus = function(e) {
      removeClasses('selected-cell')
      if (MainData[e.target.id]) {
        if (MainData[e.target.id].formula !== "") {
          e.target.value = "=" + MainData[e.target.id].formula;
        } else e.target.value = MainData[e.target.id].value;
      } else {
        MainData[e.target.id] = {};
        MainData[e.target.id].value = '';
        MainData[e.target.id].precedence = [];
        e.target.value = "";
      }
    };
    elm.onblur = function(e) {
      valueFromCell = e.target.value;
      if (valueFromCell.charAt(0) == "=") {
        MainData[e.target.id].formula = valueFromCell.substring(1);
        computeAll(e.target.id);
      } else {
        MainData[e.target.id].formula = "";
        MainData[e.target.id].value = valueFromCell;
        reCalPresedence(e.target.id);
      }
    };
  });
}


function computeAll(id) {
	var formula = MainData[id].formula || "";
	var re = /[A-Z][0-9][0-9]|[A-Z][0-9]/g;
	var m;
	var mArray = [];
	do {
		m = re.exec(formula);
		mArray.push(m);
	} while (m);
	evaluateAndPrecedence(formula, mArray, id)
}

function evaluateAndPrecedence(str, arrVar, id) {
	var newStr = ``;
	for (i = 0; i < str.length; i++) {
		let flag = 0;
		for (j = 0; j < arrVar.length - 1; j++) {
			if (arrVar[j].index == i) {
				(MainData[arrVar[j][0]].precedence).includes(id) ? null : (MainData[arrVar[j][0]].precedence).push(id);
				newStr += `${MainData[arrVar[j][0]].value}`;
				i += arrVar[j][0].length - 1;
				flag = 1;
				break;
			}
		}
		if (flag == 1) {
			continue;
		}
		else newStr += str[i];
	}
	
	if (isNaN(newStr)) {
		value = calculate(newStr);
	} else value = newStr;
	window[id].value = value;
	MainData[id].value = value;
}

function reCalPresedence(id) {
  precArr = MainData[id].precedence;
  precArr.forEach(preId => computeAll(preId));
}

// Function equavalent of Eval

function calculate(input) {
  var f = {
    add: '+',
    sub: '-',
    div: '/',
    mlt: '*',
    mod: '%',
    exp: '^'
  };

  f.obj = [
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
  for (var i = 0, n = f.obj.length; i < n; i++) {

    var re = new RegExp('(\\d+\\.?\\d*)([\\' + f.obj[i].join('\\') + '])(\\d+\\.?\\d*)');
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


// ////////////////////////////////////////////////////////////////
// /////////////// Dragging & format //////////////////////////////
// ////////////////////////////////////////////////////////////////


function selectCells(e) {
  var dragImgEl = document.createElement('span');
  dragImgEl.setAttribute('style',
    'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
  document.body.appendChild(dragImgEl);
  e.dataTransfer.setDragImage(dragImgEl, 0, 0);
  startCell = e.target.id;
}

function highlightCells(e) {
  for (let i = startCell.charCodeAt(0); i <= e.target.id.charCodeAt(0); i++) {
    for (let j = Number(startCell[1]); j <= Number(e.target.id[1]); j++) {
      var cellAddress = String.fromCharCode(i) + String(j);
      document.querySelector(`#${cellAddress}`).classList.add('selected-cell');
    }
  }
  // console.log(startCell);
  // console.log(e.target.id);
}

function assignSelectedValue(e) {
  var classToBeAssigned = e.target.dataset.name;

  var els = document.querySelectorAll(`.selected-cell`)
  if (els.length == 0) {
    document.querySelector('.active-cell').classList.toggle(`${classToBeAssigned}`)
  }
  for (var i = 0; i < els.length; i++) {
    els[i].classList.toggle(`${classToBeAssigned}`)
  }
}

function removeClasses(classNname) {
  var els = document.querySelectorAll(`.${classNname}`)
  for (var i = 0; i < els.length; i++) {
    els[i].classList.remove(`${classNname}`)
  }
}


document.querySelector(".cell-section").addEventListener("dragstart", selectCells);
document.querySelector(".cell-section").addEventListener("dragenter", highlightCells);
document.querySelector(".font-style").addEventListener('click', assignSelectedValue);