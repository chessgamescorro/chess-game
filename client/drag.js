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

        const tray = document.querySelector(`#captured-${currentPlayer.toLowerCase()}`);

        tray.append(target);
        const capturedKing = tray.querySelector('[data-piece="king"]');
        if (capturedKing) {
          kingState.textContent = `King captured, ${currentPlayer} wins!`;
            createBoard()
            rotateBoard()
            selected = null;
            infoDisplay.textContent = '';
            kingState.textContent = '';
            document.querySelectorAll('.captured').forEach(tray => {
            tray.innerHTML = '';
    })
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


});
