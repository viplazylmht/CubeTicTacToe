function Player(name, isCpu) {
    this.name = name;
    this.isCpu = isCpu;

}

var matrix = [[["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]]];

var player1 = new Player("X", false);
var player2 = new Player("O", true);

var isGameStarted = false;
var cpuActive = false;
var cpuFirst = false;

var allowInit = false;
var optimizeCpu = true;

var worker = new Worker("worker.js");
worker.addEventListener('message', function (e) {
    console.log(e.data);
    successHander(e.data);
}, false)


var currentTurn = player1;

function myClick(a, b, c) {

    var state = checkGameState(matrix);
    if (state.winPlayer !== 0) return;

    // block user init
    if (isGameStarted !== true && allowInit === false) return;

    if (play(currentTurn, a, b, c) === false) return;

    var nextTurn;

    if (currentTurn === player1) {
        nextTurn = player2;
    }
    else {
        nextTurn = player1;
    }

    // swap turn
    var tmp = currentTurn;
    currentTurn = nextTurn;
    nextTurn = tmp;

    // only init board
    if (isGameStarted !== true) return;

    // make cpu can play
    // new turn
    var t = document.getElementById("cur_turn");

    if (currentTurn.isCpu === true) {
        t.innerHTML = "CPU turn...";
        currentTurn.findBestMove(matrix);
        // worker.postMessage([matrix, currentTurn.name]);
    }

    else {
        if (currentTurn === player1) {

            t.innerHTML = "Player1's turn";
        }
        else {
            t.innerHTML = "Player2's turn";
        }
    }
}

function successHander(d) {

    var nextTurn;

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

    var t = document.getElementById("cur_turn");

    if (nextTurn.isCpu === true) {
        t.innerHTML = "Your turn";
    }
    else {
        t.innerHTML = "Player1's turn";
    }
}

function startGame() {

    var t = document.getElementById("cur_turn");

    if (isGameStarted === "end") {
        document.getElementById("inline_checkbox").style.display = "block";

        clearDOMBoard();
        // clear the board
        t.innerHTML = "Click here to Start";

        currentTurn = player1;

        // game ready
        isGameStarted = false;

        return;
    }

    // start the game
    if (isGameStarted !== false) return;

    document.getElementById("inline_checkbox").style.display = "none";

    player2.isCpu = cpuActive;

    if (cpuFirst === true) currentTurn = player2;

    var nextTurn;

    if (currentTurn === player1) {
        nextTurn = player2;
    }
    else {
        nextTurn = player1;
    }

    if (currentTurn.isCpu === true) {
        t.innerHTML = "<b>CPU turn...</b>";
        currentTurn.findBestMove(matrix);
        // worker.postMessage([matrix, currentTurn.name, cpuActive]);
    }
    else {

        if (nextTurn.isCpu === true) {
            t.innerHTML = "<b>Your turn</b>";
        }
        else {
            if (currentTurn.name === player1.name) t.innerHTML = "<b>Player1's turn</b>";
            else t.innerHTML = "<b>Player2's turn</b>";
        }
    }

    isGameStarted = true;
}

function play(player, a, b, c) {

    var pos = matrix[a][b][c];
    if (pos === "") {
        matrix[a][b][c] = player.name;
        document.getElementById(player.name.toLowerCase() + "_" + a + b + c).style.display = "";

        var t = checkGameState(matrix);
        if (t.winPlayer !== 0) {
            var dom = document.getElementById("cur_turn");

            var name;

            if (player2.isCpu) {
                if (player2.name === t.winPlayer) name = "CPU";
                else name = "You";
            }
            else {
                if (player2.name === t.winPlayer) name = "Player2";
                else name = "Player1";
            }

            dom.innerHTML = "" + name + " win!</br>Wanna play again?</b>";

            isGameStarted = "end";

            // highlight the win line
            for (var i = 0; i < t.list.length; ++i) {
                t.list[i].forEach(cell => {
                    document.getElementById("th_" + cell[0] + cell[1] + cell[2]).bgColor = "#d6fa0c";
                });
            }

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

    worker.postMessage([board, this.name, optimizeCpu]);
}

function clearDOMBoard() {
    // matrix = [[["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]], [["", "", ""], ["", "", ""], ["", "", ""]]];

    for (var i = 0; i < matrix.length; ++i) {
        for (var j = 0; j < matrix[i].length; ++j) {
            for (var k = 0; k < matrix[i][j].length; ++k) {
                // clear this pos
                matrix[i][j][k] = "";

                // earse DOM images
                document.getElementById("x_" + i + j + k).style.display = "none";
                document.getElementById("o_" + i + j + k).style.display = "none";

                // clear color
                document.getElementById("th_" + i + j + k).bgColor = "";
            }
        }
    }
}

// create a N-dimensional array according to this answer: https://stackoverflow.com/a/49732119
function NArray(...dimensions) {
    function NArrayRec(dims) {
        var first = dims[0], next = dims.slice().splice(1);
        if (dims.length > 1)
            return Array(dims[0]).fill(null).map((x, i) => NArrayRec(next));
        return Array(dims[0]).fill(null).map((x, i) => (""));
    }
    return NArrayRec(dimensions);
}

function ShowMatrix(size) {
    matrix = NArray(size, size, size);

    // dom
    var dt = document.getElementById("cube");
    while (dt.firstChild) {
        dt.removeChild(dt.firstChild);
    }

    var flatHtml;
    //dt.insertAdjacentHTML('beforeend', '<font color="red">Error, can\'t send data!</font><br>');

    for (var surface = 0; surface < size; ++surface) {
        flatHtml = '<div class="container" id="c' + surface + '">\n<table>\n';

        for (var r = 0; r < size; ++r) {
            flatHtml += '<tr>\n';

            for (var c = 0; c < size; ++c) {
                flatHtml += '<th id="th_' + surface + r + c + '" onclick="myClick(' + surface + ', ' + r + ', ' + c + ')">\n'
                    + '<img id="o_' + surface + r + c + '" src="circle-ring.svg" width="50px" style="display: none;">\n'
                    + '<img id="x_' + surface + r + c + '" src="cross.png" width="50px" style="display: none;">\n'
                    + '<h3></h3>\n'
                    + '</th>\n'
            }

            flatHtml += '</tr>\n';
        }

        flatHtml += '</table>\n</div>';

        dt.insertAdjacentHTML('beforeend', flatHtml);
    }
}

function onPlayWithCPUClick() {
    var t = document.getElementById("cb_player_type").checked;
    var dom = document.getElementById("cpu_option");

    cpuActive = t;

    if (t === true) {
        dom.style.display = "";
    }

    else dom.style.display = "none";
}

function onAllowInitialBclick() {
    allowInit = document.getElementById("cb_user_init").checked;

    if (allowInit === false) {
        clearDOMBoard();
    }
}

function onCPUFirstClick() {
    cpuFirst = document.getElementById("cb_cpu_first").checked;
}

function onCPUOptimizeClick() {
    optimizeCpu = document.getElementById("cb_cpu_optimize").checked;
}
