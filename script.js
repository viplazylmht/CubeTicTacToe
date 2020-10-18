function Player(name, isCpu) {
    this.name = name;
    this.isCpu = isCpu;

}

var matrix = [[["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]]];

var player1 = new Player("X", false);
var player2 = new Player("O", true);

var worker = new Worker("worker.js");
worker.addEventListener('message', function (e) {
    console.log(e.data);
    successHander(e.data);
}, false)


var currentTurn = player1;

function myClick(a, b, c) {

    if (play(currentTurn, a, b, c) === false) return;

    var nextTurn;

    if (currentTurn === player1) {
        nextTurn = player2;
    }
    else {
        nextTurn = player1;
    }

    // make cpu can play
    // new turn

    // swap turn
    var tmp = currentTurn;
    currentTurn = nextTurn;
    nextTurn = tmp;

    if (currentTurn.isCpu === true) {
        // this make sure 2 cpu can play together
        worker.postMessage([matrix, currentTurn.name]);
    }
}

function successHander(d) {
    if (currentTurn === player1) {
        nextTurn = player2;
    }
    else {
        nextTurn = player1;
    }

    var q = play(currentTurn, d[0], d[1], d[2]);

    if (q == false) return;

    // swap turn
    var tmp = currentTurn;
    currentTurn = nextTurn;
    nextTurn = tmp;
}

function startGame() {

    if (currentTurn.isCpu === true) {
        // this make sure 2 cpu can play together
        worker.postMessage([matrix, currentTurn.name]);
    }
}

function play(player, a, b, c) {

    var pos = matrix[a][b][c];
    if (pos === "") {
        matrix[a][b][c] = player.name;
        document.getElementById(player.name.toLowerCase() + "_" + a + b + c).style.display = "";

        var t = checkGameState(matrix);
        if (t.winPlayer !== 0) {
            alert("" + t.winPlayer + " win!");
            return false;
        }
    }
    else {
        alert("Click another position!");
        return false;
    }

    return true;
}

Player.prototype.play = async function (a, b, c) {
    var pos = matrix[a][b][c];
    if (pos === "") {
        matrix[a][b][c] = player.name;
        document.getElementById(player.name.toLowerCase() + "_" + a + b + c).style.display = "";

        var t = checkGameState(matrix);
        if (t.winPlayer !== 0) {
            alert("" + t.winPlayer + " win!");
            return false;
        }
    }
    else {
        alert("Click another position!");
        return false;
    }

    return true;
}

Player.prototype.findBestMove = function (board) {

    worker.postMessage([board, this.name]);
}

