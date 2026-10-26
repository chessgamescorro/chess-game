// Load the sound that plays after a successful move.
const moveSound = new Audio('woosh.mp3');
const moveHistory = document.querySelector('#move-history');

// Store information about a piece while it is being dragged.
let activeDrag = null;

// Prevent the click after a drag from also selecting or moving a piece.
let suppressClick = false;
let suppressClickTimer;

// Play the move sound from the beginning.
function playMoveSound() {
    moveSound.currentTime = 0;
    // Catch sound errors so they don't stop the rest of the game.
    moveSound.play().catch(error => {
        console.error('Could not play the move sound:', error);
    });
}

// Add a readable record after a move has passed all legality checks.
function recordMove(piece, fromSquare, toSquare) {
    const move = document.createElement('li');
    const pieceIcon = piece.querySelector('svg').cloneNode(true);
    pieceIcon.classList.add('move-history-piece');
    pieceIcon.setAttribute('aria-hidden', 'true');

    const moveText = document.createElement('span');
    moveText.textContent = `${fromSquare.dataset.coordinates} → ${toSquare.dataset.coordinates}`;

    move.append(pieceIcon, moveText);
    moveHistory.append(move);
    moveHistory.scrollTop = moveHistory.scrollHeight;
}

// Clear the move list when starting a new game.
document.querySelector('#resetButton').addEventListener('click', () => {
    moveHistory.innerHTML = '';
});

// End the current drag and remove its temporary visual effects.
function clearDrag() {
    if (!activeDrag) return;

    // Remove the drag preview and restore the original piece and square.
    if (activeDrag.preview) {
        activeDrag.piece.classList.remove('is-dragging');
        activeDrag.preview.remove();
        activeDrag.sourceSquare.classList.remove('selected');
    }
    activeDrag = null;
}

// Start tracking a drag when the player presses the left mouse button on a piece.
gameBoard.addEventListener('pointerdown', event => {
    const piece = event.target.closest('.piece');
    const square = piece?.closest('.square');

    // Ignore clicks that did not start on a piece on this board.
    if (!piece || !square || !gameBoard.contains(piece) || event.button !== 0) return;

    // Save the piece and pointer position so we can move its preview smoothly.
    activeDrag = {
        piece,
        sourceSquare: square,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - piece.getBoundingClientRect().left,
        offsetY: event.clientY - piece.getBoundingClientRect().top,
        preview: null
    };
});

// Move the preview along with the pointer while dragging.
document.addEventListener('pointermove', event => {
    // Ignore movement if no drag is happening or this is another pointer.
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

    // Wait for a small pointer movement before treating it as a drag.
    if (!activeDrag.preview) {
        const distance = Math.hypot(
            event.clientX - activeDrag.startX,
            event.clientY - activeDrag.startY
        );
        if (distance < 5) return;

        // Make a copy of the piece to show under the pointer.
        const bounds = activeDrag.piece.getBoundingClientRect();
        const preview = activeDrag.piece.cloneNode(true);
        preview.classList.add('drag-preview');
        preview.style.width = `${bounds.width}px`;
        preview.style.height = `${bounds.height}px`;

        // Keep the preview orientation consistent if the board is rotated.
        if (gameBoard.classList.contains('rotated')) {
            preview.classList.add('drag-preview-rotated');
        }

        // Show the preview and mark the original piece as being dragged.
        document.body.append(preview);
        activeDrag.preview = preview;
        activeDrag.piece.classList.add('is-dragging');
        activeDrag.sourceSquare.classList.add('selected');

        // Clear any piece that was selected by clicking before this drag.
        if (selected) {
            selected.parentElement.classList.remove('selected');
            selected = null;
        }
    }

    // Position the preview under the pointer, keeping the starting grab point.
    activeDrag.preview.style.left = `${event.clientX - activeDrag.offsetX}px`;
    activeDrag.preview.style.top = `${event.clientY - activeDrag.offsetY}px`;
});

// Finish the drag when the pointer is released.
document.addEventListener('pointerup', event => {
    // Ignore this event if there is no matching drag.
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

    // If the pointer barely moved, this was a click rather than a drag.
    if (!activeDrag.preview) {
        activeDrag = null;
        return;
    }

    // Find the board square under the pointer.
    const square = document.elementFromPoint(event.clientX, event.clientY)
        ?.closest('.square');
    const { piece, sourceSquare } = activeDrag;

    // Ignore the click event that the browser may send after releasing a drag.
    suppressClick = true;
    window.clearTimeout(suppressClickTimer);
    suppressClickTimer = window.setTimeout(() => {
        suppressClick = false;
    }, 0);

    // Remove the preview, then move the real piece if released on the board.
    clearDrag();
    if (square && gameBoard.contains(square)) {
        movePieceToSquare(piece, square);
    }

    // Remove the highlight from the square the piece started on.
    sourceSquare.classList.remove('selected');
});

// Clean up the preview if the browser cancels the drag.
document.addEventListener('pointercancel', event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    clearDrag();
});
