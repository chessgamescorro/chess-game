// Set the starting player to White
currentPlayer = "White";
playerDisplay.textContent = currentPlayer;
selected = null;
kingState = document.querySelector('#King-display');

let whiteScore = 0;
let blackScore = 0;
const whiteScoreDisplay = document.querySelector('#whiteScore');
const blackScoreDisplay = document.querySelector('#blackScore');

gameBoard.addEventListener('click', e => {
    const square = e.target.closest('.square');
    const piece = e.target.closest('.piece');

  if (!selected) {
    selected = piece                       // first click: pick up (null if empty square)
  } else {
    const target = square.querySelector('.piece')
    if (target !== selected) target?.remove()  // capture whatever is there
    square.append(selected)                // second click: put down
    selected = null
  }
})

    if (!square) return;

    if (!selected) {
        // Selecteer een schaakstuk
        if (!piece) return;

        selected = piece;

        // Highlight het huidige vakje
        selected.parentElement.classList.add('selected');


    
        
    } else {
        // Bewaar het oude vakje voordat de pion verplaatst wordt
        const oldSquare = selected.parentElement;
        const target = square.querySelector('.piece');

      if (target && target !== selected) {

const tray = document.querySelector(
    `#captured-${currentPlayer.toLowerCase()}`
);

const capturedKing = target.dataset.piece === "king";

tray.append(target);
if (capturedKing) {
    // Geef de speler een punt
    if (currentPlayer === "White") {
        whiteScore++;
        whiteScoreDisplay.textContent = whiteScore;
    } else {
        blackScore++;
        blackScoreDisplay.textContent = blackScore;
    }

    // Toon wie gewonnen heeft
    kingState.textContent = `${currentPlayer} wins!`;

    // Stop de selectie
    oldSquare.classList.remove('selected');
    selected = null;

    // Reset het bord na het slaan van de koning
    currentPlayer = "White";
    playerDisplay.textContent = currentPlayer;

    document.querySelectorAll('.captured').forEach(tray => {
        tray.innerHTML = '';
    });

    createBoard();

    // Zorg dat het bord niet gedraaid blijft
    gameBoard.classList.remove('rotated');
    boardFrame.classList.remove('rotated');

    return;
}
      }
            // Verplaats de pion
            square.append(selected);


            // Switch to the next player
            currentPlayer = currentPlayer === "White" ? "Black" : "White";
            playerDisplay.textContent = currentPlayer;
            rotateBoard()

            // Verwijder de paarse rand van het oude vakje
            oldSquare.classList.remove('selected');

            selected = null;

    }


