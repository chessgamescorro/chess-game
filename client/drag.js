const moveSound = new Audio('woosh.mp3');
let activeDrag = null;
let suppressClick = false;
let suppressClickTimer;

function playMoveSound() {
    moveSound.currentTime = 0;
    moveSound.play().catch(error => {
        console.error('Could not play the move sound:', error);
    });
}

function movePieceToSquare(piece, square) {
    const oldSquare = piece.parentElement;
    if (!square || !gameBoard.contains(square) || square === oldSquare) return false;

    const target = square.querySelector('.piece');

    if (target) {
        const tray = document.querySelector(
            `#captured-${currentPlayer.toLowerCase()}`
        );
        const capturedKing = target.dataset.piece === 'king';

        tray.append(target);

        if (capturedKing) {
            playMoveSound();
            updateScore(currentPlayer);
            showWinner(currentPlayer);

            selected = null;
            currentPlayer = 'White';
            playerDisplay.textContent = currentPlayer;

            document.querySelectorAll('.captured').forEach(capturedTray => {
                capturedTray.innerHTML = '';
            });

            createBoard();
            gameBoard.classList.remove('rotated');
            boardFrame.classList.remove('rotated');
            return true;
        }
    }

    square.append(piece);
    playMoveSound();
    currentPlayer = currentPlayer === 'White' ? 'Black' : 'White';
    playerDisplay.textContent = currentPlayer;
    return true;
}

function clearDrag() {
    if (!activeDrag) return;

    if (activeDrag.preview) {
        activeDrag.piece.classList.remove('is-dragging');
        activeDrag.preview.remove();
        activeDrag.sourceSquare.classList.remove('selected');
    }
    activeDrag = null;
}

gameBoard.addEventListener('pointerdown', event => {
    const piece = event.target.closest('.piece');
    const square = piece?.closest('.square');

    if (!piece || !square || !gameBoard.contains(piece) || event.button !== 0) return;

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

document.addEventListener('pointermove', event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

    if (!activeDrag.preview) {
        const distance = Math.hypot(
            event.clientX - activeDrag.startX,
            event.clientY - activeDrag.startY
        );
        if (distance < 5) return;

        const bounds = activeDrag.piece.getBoundingClientRect();
        const preview = activeDrag.piece.cloneNode(true);
        preview.classList.add('drag-preview');
        preview.style.width = `${bounds.width}px`;
        preview.style.height = `${bounds.height}px`;
        if (gameBoard.classList.contains('rotated')) {
            preview.classList.add('drag-preview-rotated');
        }

        document.body.append(preview);
        activeDrag.preview = preview;
        activeDrag.piece.classList.add('is-dragging');
        activeDrag.sourceSquare.classList.add('selected');
        if (selected) {
            selected.parentElement.classList.remove('selected');
            selected = null;
        }
    }

    activeDrag.preview.style.left = `${event.clientX - activeDrag.offsetX}px`;
    activeDrag.preview.style.top = `${event.clientY - activeDrag.offsetY}px`;
});

document.addEventListener('pointerup', event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;

    if (!activeDrag.preview) {
        activeDrag = null;
        return;
    }

    const square = document.elementFromPoint(event.clientX, event.clientY)
        ?.closest('.square');
    const { piece, sourceSquare } = activeDrag;

    suppressClick = true;
    window.clearTimeout(suppressClickTimer);
    suppressClickTimer = window.setTimeout(() => {
        suppressClick = false;
    }, 0);

    clearDrag();
    if (square && gameBoard.contains(square)) {
        movePieceToSquare(piece, square);
    }
    sourceSquare.classList.remove('selected');
});

document.addEventListener('pointercancel', event => {
    if (!activeDrag || event.pointerId !== activeDrag.pointerId) return;
    clearDrag();
});

gameBoard.addEventListener('click', event => {
    if (suppressClick) {
        suppressClick = false;
        window.clearTimeout(suppressClickTimer);
        return;
    }

    const square = event.target.closest('.square');
    const piece = event.target.closest('.piece');
    if (!square) return;

    if (!selected) {
        if (!piece) return;

        selected = piece;
        square.classList.add('selected');
        return;
    }

    if (piece === selected) {
        selected.parentElement.classList.remove('selected');
        selected = null;
        return;
    }

    const movingPiece = selected;
    const oldSquare = movingPiece.parentElement;
    movePieceToSquare(movingPiece, square);
    oldSquare.classList.remove('selected');
    selected = null;
});
