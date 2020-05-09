//Code for the slider puzzle
// 5 by 5 grid
// 4 of each colour (we should probably designate a value for every colour or smth)
// one open slot for movement 
// center 3 by 3 needs to check against the goal



function pdrawRect(x, y, w, h, color = "black") {
    pcontext.fillStyle = color;
    pcontext.fillRect(x, y, w, h);
}
function drawRectOutline(x, y, w, h, color = "black", thickness = 1) {
    pcontext.strokeStyle = color;
    pcontext.lineWidth = thickness;
    pcontext.beginPath();
    pcontext.rect(x, y, w, h);
    pcontext.stroke();
}
function pdrawText(text, x, y, size = 20, color = "black", font = "Trebuchet MS") {
    pcontext.fillStyle = color;
    pcontext.font = `${size}px ${font}`;
    pcontext.fillText(text, x, y);
}

const board = {
    squareSize: 120,
    boardState: [[], [], [], [], []],
    emptySquareLocation: [],
    complete: false,
    timeStarted: 0,
    timeElapsed: 0,
    movesMade: 0,
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
        pdrawRect(0, 0, 600, 600, 'black');//board outline
        for (let i = 0; i < 25; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const colour = (this.boardState[row][col] === 'empty') ? 'black' : this.boardState[row][col];
            pdrawRect(col*this.squareSize+1, row*this.squareSize+1,
                this.squareSize-2, this.squareSize-2, colour);
        }
        drawRectOutline(120, 120, 360, 360, 'rgba(0, 0, 0, 0.3)', 25);//middle 9 squares outline

        if (this.complete) {//winning message
            pdrawRect(190, 270, 220, 60, 'white');
            drawRectOutline(190, 270, 220, 60, 'black', 5);
            pdrawText("YOU WIN", 200, 320, 50);
        }
    },
    move: function(row, col) {//attempts to make move
        const emptyRow = this.emptySquareLocation[0];
        const emptyCol = this.emptySquareLocation[1];
        if (!this.complete && row >= 0 && row <=4 && col >= 0 && col <= 4) {
            if (row === emptyRow && Math.abs(emptyCol - col) === 1 ||//if on same row and adjacent
                col === emptyCol && Math.abs(emptyRow - row) === 1) {//if on same col and adjacent
                if (!this.timeStarted) this.timeStarted = new Date();
                this.swap(row, col, emptyRow, emptyCol);
                this.emptySquareLocation = [row, col];
                this.movesMade++;
                this.complete = this.matches(goalBoard);
                if (this.complete) {
                    this.saveHighscore();
                    updateScoreboard();
                }
            }
        }
    },
    swap: function(row1, col1, row2, col2) {//swaps 2 values in board state
        const temp = this.boardState[row1][col1];
        this.boardState[row1][col1] = this.boardState[row2][col2];
        this.boardState[row2][col2] = temp;
    },
    matches: function(goal) {//checks if middle 9 squares are same sequence as goal pattern
        const goalState = goal.goalBoardState;
        for (let i = 0; i < 9; i ++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            if (this.boardState[row+1][col+1] !== goalState[row][col]) {//if there is any mismatch
                return false;
            }
        }
        return true;//no mismatch found
    },
    reset: function() {
        this.randomize();
        this.complete = false;
        this.timeStarted = 0;
        this.timeElapsed = 0;
        this.movesMade = 0;
    },
    saveHighscore: function() {
        if (!this.getHighscore() || this.timeElapsed < this.getHighscore().split(';')[0])//if no previous data stored or if better time than previous
            localStorage.setItem('highscoreByTime', `${this.timeElapsed};${this.movesMade}`)
    },
    getHighscore: function() {
        return localStorage.getItem('highscoreByTime');
    }
}

function pmouseClicked(evt) {
    const rect = pcanvas.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;
    const row = Math.floor(mouseY / board.squareSize)
    const col = Math.floor(mouseX / board.squareSize)
    board.move(row, col);
    board.show();
    document.getElementById("move-counter").innerHTML = board.movesMade;
}

function updateScoreboard() {
    if (board.getHighscore()) {
        const scoreData = board.getHighscore().split(';');
        document.getElementById("top-time").innerHTML = scoreData[0];
        document.getElementById("top-move").innerHTML = scoreData[1];
    }
    else {
        document.getElementById("top-time").innerHTML = 'N/A';
        document.getElementById("top-move").innerHTML = 'N/A';
    }
}

setInterval(function() {//increment timer
    if (board.timeStarted && !board.complete)
        board.timeElapsed = (new Date() - board.timeStarted)/1000;
    document.getElementById("timer").innerHTML = board.timeElapsed;
    document.getElementById("move-counter").innerHTML = board.movesMade;
}, 20);





//export default board;

