const promotionDialog = document.querySelector('#promotion-dialog');
let pendingPromotion = null;

function checkPromotion(square) {
    const piece = square.querySelector('.piece');
    if (!piece || piece.dataset.piece !== 'pawn') return;

    const svg = piece.querySelector('svg');
    const isWhite = svg.classList.contains('white');
    const rank = Number(square.dataset.rank);

    if (!((isWhite && rank === 8) || (!isWhite && rank === 1))) return;

    promotionDialog.showModal();
    return new Promise(resolve => {
        pendingPromotion = { piece, resolve };
    });
}

function cancelPromotion() {
    if (!pendingPromotion) return;
    const { resolve } = pendingPromotion;
    pendingPromotion = null;
    promotionDialog.close();
    resolve(false);
}

promotionDialog.addEventListener('click', event => {
    // Close / cancel if clicking close button or clicking outside dialog backdrop
    if (event.target.closest('#close-promotion-button') || event.target === promotionDialog) {
        cancelPromotion();
        return;
    }

    const button = event.target.closest('.promotion-piece');
    if (!button || !pendingPromotion) return;

    const pieceType = button.dataset.piece;
    const pieceMarkup = { queen, rook, bishop, knight }[pieceType];
    if (!pieceMarkup) return;

    const oldSvg = pendingPromotion.piece.querySelector('svg');
    const side = oldSvg.classList.contains('white') ? 'white' : 'black';
    const template = document.createElement('template');
    template.innerHTML = pieceMarkup.trim();
    const promotedPiece = template.content.firstElementChild;
    promotedPiece.querySelector('svg').classList.add(side);
    promotedPiece.setAttribute('draggable', false);

    const { resolve } = pendingPromotion;
    pendingPromotion.piece.replaceWith(promotedPiece);
    promotionDialog.close();
    pendingPromotion = null;
    resolve(true);
});

promotionDialog.addEventListener('cancel', event => {
    event.preventDefault();
    cancelPromotion();
});
