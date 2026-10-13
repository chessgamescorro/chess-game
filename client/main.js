const gameBoard = document.querySelector('#gameboard')
const playerDisplay = document.querySelector('#player')
const infoDisplay = document.querySelector('#info-display')

const width = 8

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard() {
    startPieces.forEach((startPiece, index) => {
      const square = document.createElement('div')
      square.classList.add('square')
      const row = Math.floor(index / width)
      const column = index % width
      square.classList.add((row + column) % 2 === 0 ? 'beige' : 'brown')
      if (startPiece) {
        square.innerHTML = startPiece
        square.querySelector('svg').classList.add(index < 16 ? 'black' : 'white')
      }

      gameBoard.append(square)
    })
 }
createBoard()

