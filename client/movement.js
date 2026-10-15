function infoSquare(column, row) {

  const pieceName = document.querySelector(`.square[data-rank="${row}"][data-file="${column}"] .piece`
  );

  return pieceName ? pieceName.dataset.piece : null;

}

addEventListener('click', (e) => {
    const square = e.target.closest('.square');
    if (!square) return;

  const name = infoSquare(square.dataset.file, square.dataset.rank);
  console.log(`"${name}" found`);

});
