const square = document.querySelector('.square');
const piece = square.querySelector('.piece');

const rank = Number(square.dataset.rank);

if (piece.classList.contains('pawn') && rank === 8) {
  console.log("Piece reached end")
}
