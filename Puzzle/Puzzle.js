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
    randomize: function() {
        const availableColours = ['gray', 'white', 'blue', 'red', 'orange', 'yellow', 'green'];//gray indicates empty square
        const numberOfColours = [0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 25; i++) {
            const random = Math.floor(Math.random() * availableColours.length);
            const row = Math.floor(i / 5);
            const col = i % 5;
            this.boardState[row][col] = availableColours[random];
            numberOfColours[random]++;
            if (numberOfColours[random] >= 4 || availableColours[random] === 'gray') {
                availableColours.splice(random, 1);
                numberOfColours.splice(random, 1);
            }
        }
    },
    show: function() {
        for (let i = 0; i < 25; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            drawRect(col*this.squareSize + 1, row*this.squareSize + 1, this.squareSize, this.squareSize, this.boardState[row][col]);
        }
    }
}

drawRect(0, 0, 602, 602, 'black');//board outline
board.randomize();
board.show();