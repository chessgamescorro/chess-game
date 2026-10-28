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

promotionDialog.addEventListener('click', event => {
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

    pendingPromotion.piece.replaceWith(promotedPiece);
    promotionDialog.close();
    pendingPromotion.resolve();
    pendingPromotion = null;
});

promotionDialog.addEventListener('cancel', event => {
    event.preventDefault();
});