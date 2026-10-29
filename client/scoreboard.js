let whiteScore = 0;
let blackScore = 0;
// Selects the scoreboard elements from the DOM (HTML File).
const whiteScoreDisplay = document.querySelector('#whiteScore');
const blackScoreDisplay = document.querySelector('#blackScore');
const kingState = document.querySelector('#King-display');
// Updates the score for the given player and updates the scoreboard display.
function updateScore(player) {
    if (player === "White") {
        whiteScore++;
        whiteScoreDisplay.textContent = whiteScore;
    } else {
        blackScore++;
        blackScoreDisplay.textContent = blackScore;
    }
}
// Shows the winner message in the scoreboard section.
function showWinner(player) {
    const isDutch = typeof currentLang !== 'undefined' && currentLang === 'nl';
    const playerName = isDutch ? (player === 'White' ? 'Wit' : 'Zwart') : player;
    kingState.textContent = isDutch ? `${playerName} wint!` : `${player} wins!`;
}
