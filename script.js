const spreadSheetContainer = document.querySelector("#Spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadSheet = [];
const alphabets = [
    "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
]




class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row =row;
        this.column=column;
        this.rowName=rowName;
        this.columnName=columnName;
        this.active=active;
    }
}

exportBtn.onclick = function (e) {
    let csv = "";
    for(let i=0; i< spreadSheet.length; i++) {
        if(i===0) continue;
        csv +=
            spreadSheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n";
    }
    console.log('csv',csv);

    const csvObj = new Blob ([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click() ;
}

initSpreadsheet();

function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j=0; j<COLS; j++) {
            let cellData = '';
            let isHeader = false;
            let disabled = false;

            //모든 row 첫 번째 컬럼에 숫자 넣기
            if(j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            if (i===0) {
                cellData = alphabets[j - 1];
                isHeader =true;
                disabled = true;
            }


            //모든 첫 번째 row 컬럼은 "";
            if(!cellData) {
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j-1];
            

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell)
        }
        spreadSheet.push(spreadsheetRow);
    }
    drawSheet();    
    // console.log(spreadSheet);
}

function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange (e.target.value, cell);

    return cellEl;
}

function handleOnChange (data, cell) {
    cell.data = data ;
}

function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadSheet[0][cell.column];
    const rowHeader = spreadSheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column)
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column)
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    // console.log('clicked cell', columnHeaderEl, rowHeaderEl);
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}

function clearHeaderActiveStates() {
    const headers =document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('active')
    })
}

function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

function drawSheet() {
    for(let i = 0; i < spreadSheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";

        for(let j = 0; j <spreadSheet[i].length; j++) {
            const cell = spreadSheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);

    }
}