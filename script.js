const exportBtn = document.querySelector('#exportBtn');
const spreadSheetContainer = document.querySelector('#spreadsheet-container');

const ROWS = 10;
const COLS = 10;
const spreadsheet = []; // will be append to spreadSheetContainer 


class Cell { 
    constructor(Header, disabled, data, row, column, rowName, columnName, active = false){
        this.Header = Header;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

exportBtn.onclick = function(e) {
    let csv = ""; // 빈 string 값 생성
    for(let i = 0; i < spreadsheet.length; i++) {
        if( i === 0 ) continue; // i가 0일 때 continue => 다운로드한 엑셀 파일에서 첫째줄 비는 현상 해결
        csv+=
            spreadsheet[i] // i가 0이면
            .filter((item) => !item.Header) //헤더가 아닌 것만... filter:조건에 맞는 것들로만 배열 새로 생성
            .map((item) => item.data) // data만 필요해서 data만 return
            .join(",") + "\r\n" // 모든 배열 안의 item들을 ,를 이용해서 join 하고 한 칸 띄기
    }

    // 엑셀 파일 다운로드
    // const csvObj = new Blob([csv])
    // const csvUrl = URL.createObjectURL(csvObj)
    // console.log('csvUrl', csvUrl);

    // const a = document.createElement('a');
    // a.href = csvUrl;
    // a.download = "Spreadsheet File Name.csv";
    // a.click();
}

initSpreadsheet(); // 밑에 작성한 initSpreadsheet 함수 호출 // 위로 올라가면 호출 안됌
function initSpreadsheet() { // 값 넣어주기
    for(let i = 0; i < ROWS; i++ ) {
        let spreadsheetROW = [];
        for(let j = 0; j < COLS; j++ ) {
            let cellData = "";
            let Header = false; //원하는 곳에만 Header 줄거라서 기본은 false로
            let disabled = false;

            const alphabets = [
                "A","B","C","D","E","F","G","H","I","J","K",
                "L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
            ]

            if( j === 0 ){ // col[0]의 모든 row에 숫자 넣기
                cellData = i; // i = 0; i < ROWS; i++ => 0~9가 들어감
                Header = true; //Header로 설정
                disabled = true;
            }

            if ( i === 0 ) { // row[0]의 모든 col에 숫자 넣기
                cellData = alphabets[j - 1]; // -1하면 두번째부터 들어감 => 1~9에 들어감
                Header = true; //Header로 설정
                disabled = true;
            }

            if(!cellData) { //단일 피연산자(cellData)를 true로 변환할 수 있으면 false로 반환. false로 변환할 수 있는 표현식 중에는 "", undefined 가 있다.
                cellData = ""; 
            }

            const rowName = i;
            const columnName = alphabets[j - 1];

            const cell = new Cell(Header, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetROW.push(cell); // cell넣어서 값 나오게
            // spreadsheetROW.push(i + "-" + j); //spreadsheetROW에 0-0, 0-1,... 넣어주기
        }
        spreadsheet.push(spreadsheetROW);
    }   
    drawSheet(); // function drawSheet 호출
    // console.log(spreadsheet);
}

function createCellEl(cell) { // <div class="" id="" value="" disabled=""> 생성
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = "cell_" + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if(cell.Header) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell); // cellEl 클릭 이벤트 발생 시 handleCellClick(cell) 함수 호출

    cellEl.onchange = (e) => handleOnChange(e.target.value, cell); // 칸에 입력했을 때 handleOnChange 함수 호출
    // e.target.value = 타이핑한 거

    return cellEl;
}

function handleOnChange(data, cell) { // data는  e.target.value 받아옴
    cell.data = data; //cell.data 는 타이핑 받아온 data 값으로 변경
}

function handleCellClick(cell) { 
    columnHeaderActiveStatus(); // 클릭시 이 함수도 호출해주면 새로 클릭한 곳만 하이라이트 적용
    const columnHeader = spreadsheet[0][cell.column]; //spreadsheet row [0]번의 column들
    const rowHeader = spreadsheet[cell.row][0]; //spreadsheet row들의 column[0]번들
    const columnHeaderEl = getElementRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElementRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add("active"); // 클릭했을 때 클래스에 avtive 추가
    rowHeaderEl.classList.add("active");
    // console.log('clicked cell', columnHeaderEl, rowHeaderEl);  //클릭 된 셀의 객체 데이터 출력
    
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}

// 새로 클릭 시 이전 하이라이트 지우기
function columnHeaderActiveStatus() {
    const headers = document.querySelectorAll('.header'); // 헤더 클래스를 가진 모든 El 호출
    headers.forEach((header) => header.classList.remove("active"));
}

function getElementRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

function drawSheet() { //sheet 생성
    for(let i = 0; i < spreadsheet.length; i++) {
        const rowEl = document.createElement("div"); // row div로 감싸주기
        rowEl.className = "cell-row";
        for(let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowEl);
    }
}

