var numSelected = null;
var tileSelected = null;
var errors = 0;
var timerInterval;
var seconds = 0;
var isGameOver = false;

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

window.onload = function() {
    setGame();
    startTimer();
};

function startTimer() {
    timerInterval = setInterval(function() {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let secondsRemaining = seconds % 60;
        document.getElementById("timer").innerText = `Time: ${String(minutes).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;
    }, 1000);
}

function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    // Reset Button
    document.getElementById("reset").addEventListener("click", resetGame);

    // Hint Button
    document.getElementById("hint").addEventListener("click", giveHint);
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected && !isGameOver) {
        if (this.innerText != "") {
            return;
        }

        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            checkCompletion();
        } else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
            this.classList.add("error-tile");  // Highlight incorrect tile
        }
    }
}

function resetGame() {
    errors = 0;
    document.getElementById("errors").innerText = errors;
    seconds = 0;
    document.getElementById("timer").innerText = "Time: 00:00";
    clearInterval(timerInterval);
    startTimer();
    document.getElementById("board").innerHTML = "";
    document.getElementById("digits").innerHTML = "";
    isGameOver = false;
    setGame();
}

function giveHint() {
    if (numSelected) {
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                let tile = document.getElementById(r + "-" + c);
                if (tile && tile.innerText === "") {
                    let correctValue = solution[r][c];
                    tile.innerText = correctValue;
                    return;
                }
            }
        }
    }
}

function checkCompletion() {
    let isComplete = true;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r + "-" + c);
            if (tile && tile.innerText != solution[r][c]) {
                isComplete = false;
            }
        }
    }

    if (isComplete && !isGameOver) {
        isGameOver = true;
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);  // Stop the timer
    let score = 100 - errors * 2;  // Simple score based on errors (you can adjust the formula)
    if (score < 0) score = 0;  // Ensure the score doesn't go negative

    alert(`Game Over!\nYour Score: ${score}\nTime Taken: ${document.getElementById("timer").innerText}`);
}
