// code for the goal 3 by 3 randomization
// 9 ranomized sections with 6 possible colours
// no more than 4 of the same colours to be completable
// colours : white, blue, red, orange, yellow, green
//import board from "./Puzzle.js";

let canvas, context, pcanvas, pcontext

window.onload = function(){
    canvas = document.getElementById("goal-canvas");
    context = canvas.getContext("2d");

    canvas.addEventListener("click", mouseClicked);
    goalBoard.randomize();
    goalBoard.show();

    pcanvas = document.getElementById("puzzle-canvas");
    pcontext = pcanvas.getContext("2d");

    pcanvas.addEventListener("click", pmouseClicked);

    board.reset();
    board.show();
    updateScoreboard();

}

function drawRect(x, y, w, h, color = "black") {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawText(text, x, y, color = "black") {
    context.fillStyle = color;
    context.font = "20px Trebuchet MS";
    context.fillText(text, x, y);
}


const goalBoard = {
    goalSquareSize: 48,
    goalBoardState: [[],[],[]],
    randomize: function() {
        const availableGoalColours = ['white', 'blue', 'red', 'orange', 'yellow', 'green'];
        const frequency = [0,0,0,0,0,0];
        for (let i = 0; i < 9; i ++) {
            const random = Math.floor(Math.random() * availableGoalColours.length);
            const row = Math.floor(i / 3);
            const col = i % 3;
            this.goalBoardState[row][col] = availableGoalColours[random];
            frequency[random]++;

            if (frequency[random] >= 4 ) {
                availableGoalColours.splice(random, 1);
                frequency.splice(random, 1);
            }
        }
    },
    show: function() {
        drawRect(0, 0, 146, 146, 'black');//board outline
        for (let i = 0; i < 9; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            drawRect(col*this.goalSquareSize + 2, row*this.goalSquareSize + 2, this.goalSquareSize - 2, this.goalSquareSize - 2, this.goalBoardState[row][col]);
        }
    }
}


function mouseClicked(evt) {
    goalBoard.randomize();
    goalBoard.show();
    board.reset();
    board.show();
}


//export default goalBoard;