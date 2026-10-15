const moveSound = new Audio('woosh.mp3');

// Set the starting player to White
currentPlayer = "White";
playerDisplay.textContent = currentPlayer;
selected = null;
kingState = document.querySelector('#King-display');


gameBoard.addEventListener('click', e => {
    const square = e.target.closest('.square');
    const piece = e.target.closest('.piece');

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
    // Geeft aan wie heeft gewonnen aan scorboardw
    updateScore(currentPlayer);
    showWinner(currentPlayer);

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
const piece = selected;
const oldX = piece.getBoundingClientRect().left;
const oldY = piece.getBoundingClientRect().top;

square.append(piece);

const newX = piece.getBoundingClientRect().left;
const newY = piece.getBoundingClientRect().top;
piece.style.zIndex = "10";

piece.animate([
    { left: oldX - newX + 'px', top: oldY - newY + 'px' },
    { left: '0px', top: '0px' }
], {
    duration: 300,
    easing: 'ease-in-out'
});

// Play move sound
moveSound.currentTime = 0;
moveSound.play();



            // Switch to the next player
            currentPlayer = currentPlayer === "White" ? "Black" : "White";
            playerDisplay.textContent = currentPlayer;


            // Verwijder de paarse rand van het oude vakje
            oldSquare.classList.remove('selected');

            selected = null;

    }

});
