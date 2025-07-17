const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Settings
const ROWS = 8;
const COLS = 8;
const SQUARE_SIZE = canvas.width / COLS;
const COLORS = ["#ff6666", "#ffcc66", "#66cc66", "#66ccff", "#cc66ff"]; // Candy colors

let board = [];
let score = 0;
let level = 1;
let selected = null;

document.getElementById("score").innerText = score;
document.getElementById("level").innerText = level;

// Initialize Game
function initGame() {
    board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = randomColor();
        }
    }
    removeMatches();
    drawBoard();
}

function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// Draw Board
function drawBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            ctx.fillStyle = board[row][col];
            ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
        }
    }
}

// Handle Clicks
canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / SQUARE_SIZE);
    const row = Math.floor((e.clientY - rect.top) / SQUARE_SIZE);

    if (!selected) {
        selected = { row, col };
    } else {
        swap(selected.row, selected.col, row, col);
        selected = null;
        drawBoard();
    }
});

// Swap candies
function swap(r1, c1, r2, c2) {
    if (areAdjacent(r1, c1, r2, c2)) {
        [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
        if (hasMatches()) {
            animateSwap(r1, c1, r2, c2);
            removeMatches();
        } else {
            // Revert if no match
            [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
        }
    }
}

// Check adjacency
function areAdjacent(r1, c1, r2, c2) {
    return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
}

// Check for matches
function hasMatches() {
    return findMatches().length > 0;
}

// Find all matches
function findMatches() {
    let matches = [];

    // Horizontal
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS - 2; col++) {
            if (board[row][col] && board[row][col] === board[row][col + 1] && board[row][col] === board[row][col + 2]) {
                matches.push({ row, col }, { row, col: col + 1 }, { row, col: col + 2 });
            }
        }
    }

    // Vertical
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS - 2; row++) {
            if (board[row][col] && board[row][col] === board[row + 1][col] && board[row][col] === board[row + 2][col]) {
                matches.push({ row, col }, { row: row + 1, col }, { row: row + 2, col });
            }
        }
    }

    return matches;
}

// Remove matches
function removeMatches() {
    let matches = findMatches();
    if (matches.length === 0) return;

    // Add score
    score += matches.length;
    document.getElementById("score").innerText = score;

    // Clear matched candies
    matches.forEach(({ row, col }) => {
        board[row][col] = null;
    });

    // Drop candies
    for (let col = 0; col < COLS; col++) {
        let bottom = ROWS - 1;
        for (let row = ROWS - 1; row >= 0; row--) {
            if (board[row][col] !== null) {
                board[bottom--][col] = board[row][col];
            }
        }
        for (let row = bottom; row >= 0; row--) {
            board[row][col] = randomColor();
        }
    }

    setTimeout(removeMatches, 200); // Recursively check for new matches
}

// Animate swap
function animateSwap(r1, c1, r2, c2) {
    let temp = board[r1][c1];
    board[r1][c1] = null;
    drawBoard();
    setTimeout(() => {
        board[r2][c2] = null;
        drawBoard();
        setTimeout(() => {
            [board[r1][c1], board[r2][c2]] = [temp, temp];
            drawBoard();
        }, 100);
    }, 100);
}

// Restart Game
document.getElementById("restartBtn").addEventListener("click", () => {
    score = 0;
    level = 1;
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    initGame();
});

// Start Game
initGame();
