

// Cache the page elements used to display the board and game status.
const gameBoard = document.querySelector('#gameboard')
const boardFrame = document.querySelector('.board-frame')
const playerDisplay = document.querySelector('#player')

// The board has eight squares in each row and column.
const width = 8

// Turn Status
let currentPlayer = "White";
let selected = null;
let gameOver = false;
// Keep track of moved piece elements so a king or rook cannot regain castling rights by returning.
let movedPieces = new WeakSet();

// Store the starting position row by row, using empty strings for empty squares.
let startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function updateStartPieces() {
    startPieces = [
        rook, knight, bishop, queen, king, bishop, knight, rook,
        pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        '', '', '', '', '', '', '', '',
        pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
        rook, knight, bishop, queen, king, bishop, knight, rook
    ];
}

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
    { light: 'rgb(9, 9, 9)', dark: 'rgb(155, 9, 9)' },
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
    if (typeof cancelPromotion === 'function') {
        cancelPromotion();
    }
    if (typeof revertToLiveGame === 'function') {
        revertToLiveGame();
    }
    if (typeof clearHistorySnapshots === 'function') {
        clearHistorySnapshots();
    }
    boardColors = 0;
    document.querySelector('#resetButton').style.backgroundColor = boardPalettes[0].dark
    document.querySelector('.scoreboard h2').style.color = boardPalettes[0].dark
    currentPlayer = 'White';
    updateTurnDisplay();
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
    kingState.textContent = '';
    document.querySelector('#win-dialog').close();
}

resetButton.addEventListener('click', resetGame);
document.querySelector('#new-game-button').addEventListener('click', resetGame);
document.querySelector('#view-board-button').addEventListener('click', () => {
    document.querySelector('#win-dialog').close();
});

// Revert board to live game when button clicked
const revertHistoryBtn = document.querySelector('#revertHistoryBtn');
if (revertHistoryBtn) {
    revertHistoryBtn.addEventListener('click', () => {
        if (typeof revertToLiveGame === 'function') {
            revertToLiveGame();
        }
    });
}

// Toggle between custom chess pieces and classic SVG pieces
const changePiecesButton = document.querySelector('#changePieces');
if (changePiecesButton) {
    changePiecesButton.addEventListener('click', () => {
        togglePieceStyle();
    });
}

// Rules popup dashboard handling
const rulesButton = document.querySelector('#rulesButton');
const rulesDialog = document.querySelector('#rules-dialog');
const closeRulesButton = document.querySelector('#close-rules-button');
const rulesGotItButton = document.querySelector('#rules-got-it-button');

if (rulesButton && rulesDialog) {
    rulesButton.addEventListener('click', () => {
        rulesDialog.showModal();
    });
}

if (closeRulesButton && rulesDialog) {
    closeRulesButton.addEventListener('click', () => {
        rulesDialog.close();
    });
}

if (rulesGotItButton && rulesDialog) {
    rulesGotItButton.addEventListener('click', () => {
        rulesDialog.close();
    });
}

if (rulesDialog) {
    rulesDialog.addEventListener('click', event => {
        if (event.target === rulesDialog) {
            rulesDialog.close();
        }
    });
}

// Dashboard tab switching
const rulesTabButtons = document.querySelectorAll('.rules-tab-btn');
const rulesPanels = document.querySelectorAll('.rules-tab-panel');

rulesTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        rulesTabButtons.forEach(b => b.classList.toggle('active', b === btn));
        rulesPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${targetTab}`);
        });
    });
});

// Localization (i18n) & Flag Switcher
var currentLang = (typeof localStorage !== 'undefined' && localStorage.getItem('chess_lang')) || 'nl';

const translations = {
    en: {
        headerTitle: "Schaakspel Projectweek 1 2026",
        headerSubtitle: "Gebouwd in HTML, CSS, JavaScript door Redouan, Mikolaj, Wiktoria, Grantas",
        scoreboardHeading: "Scoreboard",
        whiteLabel: "White:",
        blackLabel: "Black:",
        moveHistoryHeading: "Move history",
        newGame: "New game",
        changeTheme: "Change theme",
        rotateBoard: "Rotate board",
        changePieces: "Change pieces",
        chessRules: "Chess rules",
        promotionHeading: "Pawn promotion",
        promotionPrompt: "Select a piece to promote your pawn:",
        queen: "Queen",
        rook: "Rook",
        bishop: "Bishop",
        knight: "Knight",
        viewBoard: "View board",
        rulesHeading: "Chess Guide & Dashboard",
        rulesSubtitle: "Everything you need to know about chess and how to play",
        tabOverview: "Overview & Goal",
        tabPieces: "Pieces & Movement",
        tabSpecial: "Special Rules",
        tabControls: "How to Play",
        goalTitle: "Goal of the Game",
        goalDesc: "The ultimate objective in chess is to <strong>checkmate</strong> the opponent's king. This happens when the opponent's king is under immediate attack (in check) and has no legal escape.",
        boardTitle: "The Board & Setup",
        boardDesc: "Chess is played on an <strong>8&times;8 grid</strong> with 64 alternating dark and light squares. Horizontal rows are called <strong>ranks</strong> (1–8) and vertical columns are <strong>files</strong> (a–h).",
        turnsTitle: "Turn Order & Clock",
        turnsDesc: "<strong>White always moves first</strong>. Players take turns moving one piece per turn. You cannot skip or pass a turn, and you can never move into or remain in check.",
        capturesTitle: "Capturing Pieces",
        capturesDesc: "A piece captures an enemy piece by landing on its square. The captured piece is permanently removed from the board into the captured tray. The King is never captured.",
        kingName: "King",
        kingMoves: "<strong>Moves:</strong> 1 square in any direction (horizontal, vertical, diagonal).",
        kingRole: "<strong>Role:</strong> The most crucial piece. Must be defended at all costs. Can participate in castling with an unmoved rook.",
        queenName: "Queen",
        queenMoves: "<strong>Moves:</strong> Any number of empty squares horizontally, vertically, or diagonally.",
        queenRole: "<strong>Role:</strong> The most powerful attacking piece on the board, combining the powers of a rook and bishop.",
        rookName: "Rook",
        rookMoves: "<strong>Moves:</strong> Any number of empty squares in a straight line along ranks (rows) or files (columns).",
        rookRole: "<strong>Role:</strong> Dominates open files and coordinates with the king for castling.",
        bishopName: "Bishop",
        bishopMoves: "<strong>Moves:</strong> Any number of empty squares diagonally.",
        bishopRole: "<strong>Role:</strong> Stays on squares of its starting color for the entire match (light-squared or dark-squared).",
        knightName: "Knight",
        knightMoves: "<strong>Moves:</strong> In an \"L-shape\": two squares in one direction and one square perpendicular.",
        knightSpecial: "<strong>Special:</strong> The <em>only</em> piece that can jump over other friendly or enemy pieces!",
        pawnName: "Pawn",
        pawnMoves: "<strong>Moves:</strong> 1 square forward (or 2 squares forward on its very first move). Captures 1 square diagonally forward.",
        pawnSpecial: "<strong>Special:</strong> Cannot move backward. Promotes upon reaching the opposite end of the board.",
        checkTitle: "Check & Checkmate",
        checkList: "<li><strong>Check:</strong> When a king is attacked. The player must escape check immediately by moving the king, blocking the attack, or capturing the attacker.</li><li><strong>Checkmate:</strong> When the king is in check and cannot escape. Checkmate immediately concludes the match with a win!</li>",
        castlingTitle: "Castling (Rokade)",
        castlingDesc: "A special joint move where the king moves 2 squares toward a rook, and the rook hops over to the square beside the king.",
        castlingList: "<li>Neither the king nor the rook has moved yet.</li><li>All squares between them must be empty.</li><li>The king cannot castle out of, through, or into check.</li>",
        promotionCardTitle: "Pawn Promotion",
        promotionCardDesc: "When a pawn reaches the furthest rank on the board (rank 8 for White, rank 1 for Black), it immediately promotes into a <strong>Queen, Rook, Bishop, or Knight</strong>. A popup dialog will appear for you to choose your promoted piece.",
        howToMoveTitle: "How to Move",
        howToMoveDesc: "Click on any piece of your color to select it — dots will appear highlighting all legal destination squares. Click an empty highlighted square or enemy piece to complete your move. You can also drag and drop pieces directly.",
        changePiecesTitle: "Change Pieces",
        changePiecesDesc: "Use the <strong>Change pieces</strong> button in the action panel to switch dynamically between the custom hand-drawn pieces and the classic vector SVG chess pieces at any time without resetting the game.",
        themesRotationTitle: "Themes & Rotation",
        themesRotationList: "<li><strong>Change theme:</strong> Cycles through different board palettes (Red & Dark, Pastel Pink, Cyan Blue, Forest Green).</li><li><strong>Rotate board:</strong> Flips the board 180&deg; for White or Black perspective.</li>",
        scoreHistoryTitle: "Scoreboard & New Game",
        scoreHistoryList: "<li><strong>Scoreboard:</strong> Keeps track of wins for White and Black across your play sessions.</li><li><strong>Move history:</strong> Logs every move with piece icons and coordinates (e.g. e2 &rarr; e4).</li><li><strong>New game:</strong> Clears the board and starts a fresh match.</li>",
        returnToLiveGame: "Return to live game",
        gotItBtn: "Got it, let's play!"
    },
    nl: {
        headerTitle: "Schaakspel Projectweek 1 2026",
        headerSubtitle: "Gebouwd in HTML, CSS, JavaScript door Redouan, Mikolaj, Wiktoria, Grantas",
        scoreboardHeading: "Scorebord",
        whiteLabel: "Wit:",
        blackLabel: "Zwart:",
        moveHistoryHeading: "Zettenlijst",
        newGame: "Nieuw spel",
        changeTheme: "Verander thema",
        rotateBoard: "Draai bord",
        changePieces: "Verander stukken",
        chessRules: "Spelregels",
        promotionHeading: "Pionpromotie",
        promotionPrompt: "Kies een stuk om je pion te promoveren:",
        queen: "Dame",
        rook: "Toren",
        bishop: "Loper",
        knight: "Paard",
        viewBoard: "Bekijk bord",
        rulesHeading: "Schaakregels & Dashboard",
        rulesSubtitle: "Alles wat je moet weten over schaken en hoe je speelt",
        tabOverview: "Speloverzicht & Doel",
        tabPieces: "Stukken & Beweging",
        tabSpecial: "Speciale Regels",
        tabControls: "Spelbediening",
        goalTitle: "Doel van het spel",
        goalDesc: "Het uiteindelijke doel van schaken is om de vijandelijke koning <strong>schaakmat</strong> te zetten. Dit gebeurt wanneer de vijandelijke koning direct wordt aangevallen (schaak staat) en niet kan ontsnappen.",
        boardTitle: "Het bord & Opstelling",
        boardDesc: "Schaken wordt gespeeld op een <strong>8&times;8 bord</strong> met 64 afwisselend donkere en lichte velden. Horizontale rijen heten <strong>rijen</strong> (1–8) en verticale kolommen heten <strong>lijnen</strong> (a–h).",
        turnsTitle: "Beurtvolgorde",
        turnsDesc: "<strong>Wit mag altijd als eerste zetten</strong>. Spelers zetten om de beurt één stuk per beurt. Je mag een beurt nooit overslaan en je mag jezelf nooit schaak zetten.",
        capturesTitle: "Stukken slaan",
        capturesDesc: "Een stuk slaat een vijandelijk stuk door op hetzelfde veld te landen. Het geslagen stuk verdwijnt van het bord naar het bakje met geslagen stukken. De koning kan nooit worden geslagen.",
        kingName: "Koning",
        kingMoves: "<strong>Zet:</strong> 1 veld in elke richting (horizontaal, verticaal of diagonaal).",
        kingRole: "<strong>Rol:</strong> Het belangrijkste stuk. Moet te allen tijde worden beschermd. Kan rokeren met een toren die nog niet bewogen heeft.",
        queenName: "Dame",
        queenMoves: "<strong>Zet:</strong> Willekeurig aantal vrije velden horizontaal, verticaal of diagonaal.",
        queenRole: "<strong>Rol:</strong> Het sterkste aanvallende stuk op het bord, combineert de krachten van toren en loper.",
        rookName: "Toren",
        rookMoves: "<strong>Zet:</strong> Willekeurig aantal vrije velden in een rechte lijn over lijnen of rijen.",
        rookRole: "<strong>Rol:</strong> Beheerst open lijnen en werkt samen met de koning voor de rokade.",
        bishopName: "Loper",
        bishopMoves: "<strong>Zet:</strong> Willekeurig aantal vrije velden diagonaal.",
        bishopRole: "<strong>Rol:</strong> Blijft de hele partij op velden van zijn startkleur (wit- of zwartveldig).",
        knightName: "Paard",
        knightMoves: "<strong>Zet:</strong> In een \"L-vorm\": twee velden in één richting en één veld loodrecht daarop.",
        knightSpecial: "<strong>Speciaal:</strong> Het <em>enige</em> stuk dat over andere eigen of vijandelijke stukken heen mag springen!",
        pawnName: "Pion",
        pawnMoves: "<strong>Zet:</strong> 1 veld recht vooruit (of 2 velden vooruit bij zijn allereerste zet). Slaat 1 veld schuin vooruit.",
        pawnSpecial: "<strong>Speciaal:</strong> Kan nooit achteruit. Promoveert zodra hij de overkant van het bord bereikt.",
        checkTitle: "Schaak & Schaakmat",
        checkList: "<li><strong>Schaak:</strong> Wanneer een koning wordt aangevallen. De speler moet direct pareren door de koning te verplaatsen, het schaak af te dekken of de aanvaller te slaan.</li><li><strong>Schaakmat:</strong> Wanneer de koning schaak staat en niet kan ontsnappen. Schaakmat beëindigt de partij direct met een overwinning!</li>",
        castlingTitle: "Rokade (Castling)",
        castlingDesc: "Een speciale dubbelzet waarbij de koning twee velden naar een toren beweegt en de toren over de koning springt naar het veld ernaast.",
        castlingList: "<li>Koning en toren hebben beiden nog niet bewogen.</li><li>Alle velden ertussen moeten leeg zijn.</li><li>De koning mag niet rokeren vanuit, over of naar een veld dat schaak staat.</li>",
        promotionCardTitle: "Pionpromotie",
        promotionCardDesc: "Wanneer een pion de overzijde van het bord bereikt (rij 8 voor wit, rij 1 voor zwart), promoveert hij direct tot een <strong>Dame, Toren, Loper of Paard</strong>. Er verschijnt een pop-up waarin je je gewenste stuk kiest.",
        howToMoveTitle: "Stukken verplaatsen",
        howToMoveDesc: "Klik op een stuk van jouw kleur om het te selecteren — stippen tonen alle geldige zetten. Klik op een gemarkeerd veld of vijandelijk stuk om te zetten. Je kunt stukken ook direct slepen en neerzetten.",
        changePiecesTitle: "Stukken wisselen",
        changePiecesDesc: "Gebruik de knop <strong>Verander stukken</strong> in het bedieningspaneel om op elk moment te wisselen tussen de handgetekende stukken en de klassieke vector SVG-schaakstukken zonder het spel te resetten.",
        themesRotationTitle: "Thema's & Draaien",
        themesRotationList: "<li><strong>Verander thema:</strong> Wisselt tussen verschillende bordpaletten (Rood & Donker, Pastelroze, Cyaanblauw, Bosgroen).</li><li><strong>Draai bord:</strong> Draait het bord 180&deg; voor wit- of zwartperspectief.</li>",
        scoreHistoryTitle: "Scorebord & Nieuw spel",
        scoreHistoryList: "<li><strong>Scorebord:</strong> Houdt overwinningen voor Wit en Zwart bij over al je partijen.</li><li><strong>Zettenlijst:</strong> Houdt elke zet bij met stuk-icoon en coördinaten (bijv. e2 &rarr; e4).</li><li><strong>Nieuw spel:</strong> Zet het bord klaar voor een nieuwe partij.</li>",
        returnToLiveGame: "Terug naar live partij",
        gotItBtn: "Begrepen, laten we spelen!"
    }
};

function updateTurnDisplay() {
    const playerDisplay = document.querySelector('#player');
    const turnPrefix = document.querySelector('#turnPrefix');
    const turnSuffix = document.querySelector('#turnSuffix');
    const isDutch = currentLang === 'nl';
    const displayName = isDutch ? (currentPlayer === 'White' ? 'Wit' : 'Zwart') : currentPlayer;
    if (turnPrefix) turnPrefix.textContent = isDutch ? "Het is de beurt aan " : "It's ";
    if (turnSuffix) turnSuffix.textContent = isDutch ? "" : "'s turn";
    if (playerDisplay) playerDisplay.textContent = displayName;
}

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem('chess_lang', lang); } catch (e) {}
    }
    document.documentElement.lang = lang;

    // Update flag switcher buttons
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[lang][key] !== undefined) {
            el.innerHTML = translations[lang][key];
        }
    });

    updateTurnDisplay();
}

// Wire up flag switcher buttons
document.querySelectorAll('.lang-flag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

// Initialize display and language
setLanguage(currentLang);
