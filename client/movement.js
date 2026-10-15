/*function getSquare(r, c) {
    return document.querySelectorAll(`.square[data-row="${r}"][data-col="${c}"]`);
}*/

/* function infoSquare(row, column) {
    return document.querySelector(`.square[data-row="${row}"][data-col="${column}"]`);
} */


function infoSquare(row, column) {

    return document.querySelector(`.square[data-rank="${row}"][data-file="${column}"] .piece`);

}


