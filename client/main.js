
// Cache the page elements used to display the board and game status.
const gameBoard = document.querySelector('#gameboard')
const playerDisplay = document.querySelector('#player')
const infoDisplay = document.querySelector('#info-display')

// The board has eight squares in each row and column.
const width = 8

// Store the starting position row by row, using empty strings for empty squares.
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

// Create all board squares and place the starting pieces on them.
function createBoard() {
    // Use each array index to determine the square's position and color.
    startPieces.forEach((startPiece, index) => {
      const square = document.createElement('div')
      square.classList.add('square')
      const row = Math.floor(index / width)
      const column = index % width
      square.classList.add((row + column) % 2 === 0 ? 'beige' : 'brown')

      // Add the piece markup and assign its side based on its starting rank.
      if (startPiece) {
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.querySelector('svg').classList.add(index < 16 ? 'black' : 'white')
      }

      // Set the piece color based on its starting rank.
      if (index <= 15) {
        square.querySelector('svg').classList.add('black')
      } else if (index >= 48) {
        square.querySelector('svg').classList.add('white')
      }

      // Attach the completed square to the board.
      gameBoard.append(square)
    })
 }

// Render the initial chess position when the script loads.
createBoard()


// Zoek de knop op
const changeButton = document.querySelector('#submitButton')

// Houd bij welke kleurencombinatie actief is
let boardColors = 0

// Verander de bordkleuren wanneer je op de knop klikt
changeButton.addEventListener('click', () => {
    const beigeSquares = document.querySelectorAll('.beige')
    const brownSquares = document.querySelectorAll('.brown')

    // Verhoog het nummer bij elke klik
    boardColors++

    if (boardColors % 3 === 1) {
        // Kleurencombinatie 1
        beigeSquares.forEach(square => {
            square.style.backgroundColor = '#f0d9b5'
        })

        brownSquares.forEach(square => {
            square.style.backgroundColor = '#b58863'
        })

    } else if (boardColors % 3 === 2) {
        // Kleurencombinatie 2
        beigeSquares.forEach(square => {
            square.style.backgroundColor = '#f0d9b5'
        })

        brownSquares.forEach(square => {
            square.style.backgroundColor = '#eb83d4'
        })

    } else {
        // Terug naar de originele kleuren
        beigeSquares.forEach(square => {
            square.style.backgroundColor = 'rgb(238, 238, 210)'
        })

        brownSquares.forEach(square => {
            square.style.backgroundColor = 'rgb(118, 150, 86)'
        })
    }
})