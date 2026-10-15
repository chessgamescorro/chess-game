let whiteScore = 0;
let blackScore = 0;

const whiteScoreDisplay = document.querySelector('#whiteScore');
const blackScoreDisplay = document.querySelector('#blackScore');
const kingState = document.querySelector('#King-display');

function updateScore(player) {
    if (player === "White") {
        whiteScore++;
        whiteScoreDisplay.textContent = whiteScore;
    } else {
        blackScore++;
        blackScoreDisplay.textContent = blackScore;
    }
}

function showWinner(player) {
    kingState.textContent = `${player} wins!`;
}