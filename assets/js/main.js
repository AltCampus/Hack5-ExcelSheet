
displayCells();

function displayCells(){
	var cellSection = document.querySelector('.cell-section');
	var cellContent = "";
	var id ="";

	for (let i = 0;i<20;i++){
		cellContent += `<div class="row">`
		for (let j = 0;j<26;j++){
			if (i==0){ cellContent += `<div class="column-headers">${String.fromCharCode(j+65)}</div>` ;continue;}
			if (j==0){ cellContent += `<div class="row-headers">${i}</div>` ;continue;}
			id = String.fromCharCode(j+65-1) + (i);
			cellContent += `<input type="text" id="${id}"> `
		}
		cellContent += `</div>`
	}
	cellSection.innerHTML = cellContent;
}


