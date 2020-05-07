//Code for the slider puzzle
// 5 by 5 grid
// 4 of each colour (we should probably designate a value for every colour or smth)
// one open slot for movement 
// center 3 by 3 needs to check against the goal
// colours : white, blue, red, orange, yellow, green

const canvas = document.getElementById("puzzle-canvas");
const context = canvas.getContext("2d");

function drawRect(x, y, w, h, color = "black") {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawText(text, x, y, color = "black") {
    context.fillStyle = color;
    context.font = "20px Trebuchet MS";
    context.fillText(text, x, y);
}

const board = {
    squareSize: 120,
    boardState: [[], [], [], [], []],
    emptySquareLocation: [],
    randomize: function() {
        const availableColours = ['empty', 'white', 'blue', 'red', 'orange', 'yellow', 'green'];//gray indicates empty square
        const numberOfColours = [0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 25; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;

            const random = Math.floor(Math.random() * availableColours.length);
            this.boardState[row][col] = availableColours[random];//add colour to board state
            numberOfColours[random]++;//counts number of colours already on board, max 1 for empty and max 4 for rest

            if (availableColours[random] === 'empty') {
                this.emptySquareLocation[0] = row;
                this.emptySquareLocation[1] = col;
            }

            if (availableColours[random] === 'empty' || numberOfColours[random] >= 4) {//if max number of colour is reached, remove from available colours
                availableColours.splice(random, 1);
                numberOfColours.splice(random, 1);
            }
        }
    },
    show: function() {
        drawRect(0, 0, 600, 600, 'black');//board outline
        for (let i = 0; i < 25; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const colour = (this.boardState[row][col] === 'empty') ? 'black' : this.boardState[row][col];
            drawRect(col*this.squareSize+1, row*this.squareSize+1,
                this.squareSize-2, this.squareSize-2, colour);
        }
        context.strokeStyle = "rgba(0, 0, 0, 0.3)"
        context.lineWidth = 25;
        context.beginPath();
        context.rect(120, 120, 360, 360);
        context.stroke();
    },
    move: function(row, col) {//attempts to make move
        const emptyRow = this.emptySquareLocation[0];
        const emptyCol = this.emptySquareLocation[1];
        if (row >= 0 && row <=4 && col >= 0 && col <= 4) {
            if (row === emptyRow && Math.abs(emptyCol - col) === 1 ||//if on same row and adjacent
                col === emptyCol && Math.abs(emptyRow - row) === 1) {//if on same col and adjacent
                this.swap(row, col, emptyRow, emptyCol);
                this.emptySquareLocation = [row, col];
            }
        }
    },
    swap: function(row1, col1, row2, col2) {//swaps 2 values in board state
        const temp = this.boardState[row1][col1];
        this.boardState[row1][col1] = this.boardState[row2][col2];
        this.boardState[row2][col2] = temp;
    },
    verify: function(goal) {//checks if middle 9 squares are same sequence as goal pattern
        return false;
    }
}

function mouseClicked(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;
    const row = Math.floor(mouseY / board.squareSize)
    const col = Math.floor(mouseX / board.squareSize)
    board.move(row, col);
    board.show();
}

canvas.addEventListener("click", mouseClicked);

board.randomize();
board.show();