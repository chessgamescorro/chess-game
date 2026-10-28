

// Cache the page elements used to display the board and game status.
const gameBoard = document.querySelector('#gameboard')
const boardFrame = document.querySelector('.board-frame')
const playerDisplay = document.querySelector('#player')
const infoDisplay = document.querySelector('#info-display')

// The board has eight squares in each row and column.
const width = 8

// Turn Status
let currentPlayer = "White";
let selected = null;
let gameOver = false;
// Keep track of moved piece elements so a king or rook cannot regain castling rights by returning.
let movedPieces = new WeakSet();
playerDisplay.textContent = currentPlayer;

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
    gameBoard.innerHTML = ''
    startPieces.forEach((startPiece, index) => {
      const square = document.createElement('div')
      square.classList.add('square')
      const row = Math.floor(index / width)
      const column = index % width
      square.classList.add((row + column) % 2 === 0 ? 'beige' : 'brown')


      // Voegt de dataset-attributen toe om de positie en kleur te identificeren.
      square.dataset.row = row
      square.dataset.column = column
      square.dataset.coordinates = `abcdefgh`[column] + (8 - row)
      square.classList.add('row')
      square.classList.add('column')
      square.dataset.file = `abcdefgh`[column]
      square.dataset.rank = 8 - row


      // Add the piece markup and assign its side based on its starting rank.
      if (startPiece) {
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', false)
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
const changeButton = document.querySelector('#changeboard')

// The first palette matches the board's default CSS colors.
const boardPalettes = [
    { light: 'rgb(238, 238, 210)', dark: 'rgb(155, 9, 9)' },
    { light: '#f0d9b5', dark: '#eb83d4' },
    { light: 'rgb(238, 238, 210)', dark: '#00b7ff' },
    { light: 'rgb(238, 238, 210)', dark: 'rgb(118, 150, 86)' }
]

// Houd bij welke kleurencombinatie actief is
let boardColors = 0

// Verander de bordkleuren wanneer je op de knop klikt
changeButton.addEventListener('click', () => {
    boardColors = (boardColors + 1) % boardPalettes.length
    const palette = boardPalettes[boardColors]
    document.querySelector('#resetButton').style.backgroundColor = palette.dark
    document.querySelector('.scoreboard h2').style.color = palette.dark
    document.querySelectorAll('.beige').forEach(square => {
        square.style.backgroundColor = palette.light
    })
    document.querySelectorAll('.brown').forEach(square => {
        square.style.backgroundColor = palette.dark
    })
})

        function rotateBoard(){
            
            gameBoard.classList.toggle('rotated')
            boardFrame.classList.toggle('rotated')
            document.querySelector('.board-area').classList.toggle('rotated')
        }

const rotateButton = document.querySelector('#rotateBoard')
rotateButton.addEventListener('click', rotateBoard)

const resetButton = document.querySelector('#resetButton');

function resetGame() {
    boardColors = 0;
    document.querySelector('#resetButton').style.backgroundColor = boardPalettes[0].dark
    document.querySelector('.scoreboard h2').style.color = boardPalettes[0].dark
    currentPlayer = 'White';
    playerDisplay.textContent = currentPlayer;
    selected = null;
    gameOver = false;
    // A fresh game gives the newly created kings and rooks their castling rights back.
    movedPieces = new WeakSet();
    gameBoard.classList.remove('rotated');
    boardFrame.classList.remove('rotated');
    document.querySelector('.board-area').classList.remove('rotated');
    document.querySelectorAll('.captured').forEach(tray => {
        tray.innerHTML = '';
    });
    createBoard();
    document.querySelector('#move-history').innerHTML = '';
    infoDisplay.textContent = '';
    kingState.textContent = '';
    document.querySelector('#win-dialog').close();
}

resetButton.addEventListener('click', resetGame);
document.querySelector('#new-game-button').addEventListener('click', resetGame);
document.querySelector('#view-board-button').addEventListener('click', () => {
    document.querySelector('#win-dialog').close();
});
