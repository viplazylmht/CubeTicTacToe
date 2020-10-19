
this.addEventListener('message', function (e) {

    //console.log(e.data);
    var d = findBestMove(e.data[0], e.data[1])

    this.postMessage(d);
}, false);

// varible global
var alphaIn = 0, betaIn = 0;
const INFINITY = 1000000000;
const MAX_DEPTH = 4;

function findBestMove(board, playerName) {
    var best = -INFINITY;
    var result = [];

    // Traverse all cells
    for (var i = 0; i < 3; ++i) {
        for (var j = 0; j < 3; ++j) {
            for (var k = 0; k < 3; ++k) {
                // if cell empty
                if (board[i][j][k] === "") {

                    // Make the move
                    board[i][j][k] = playerName;

                    // Call minimax recursively and choose 
                    // the maximum value 
                    var move = minimax(board, 0, false, playerName, -INFINITY, INFINITY);

                    if (move > best) {
                        best = move;

                        result = [i, j, k];
                    }
                    // Undo the move 
                    board[i][j][k] = "";

                }
            }
        }
    }

    return result;
}

// return a list of win-line (json)
// else winPlayer will be assigned by 0

function checkGameState(matrix) {
    var i, j, k, item;
    var result = {};
    result.winPlayer = 0;
    result.list = [];

    // for each surface (hozinotal)
    for (i = 0; i < 3; i++) {

        // check all row
        for (j = 0; j < 3; j++) {
            var t = 0;
            var p = [];

            for (k = 0; k < 3; k++) {

                item = matrix[i][j][k];

                if (item !== "" && (t == 0 || t === item)) {
                    t = item;

                    p.push([i, j, k]);
                }
                else {
                    t = 0;
                    break;
                }
            }

            // there have at least 1 row in all "x" or "o"
            // return "x" || "o"
            if (t !== 0) {
                if (result.winPlayer === 0) result.winPlayer = t;

                if (result.winPlayer === t) {
                    result.list.push(p);
                }
            };
        }

        // check all column
        for (j = 0; j < 3; j++) {
            var t = 0;
            var p = [];

            for (k = 0; k < 3; k++) {

                item = matrix[i][k][j];
                if (item !== "" && (t == 0 || t === item)) {
                    t = item;
                    p.push([i, k, j]);
                }
                else {
                    t = 0;
                    break;
                }
            }

            // there have at least 1 row in all "x" or "o"
            // return "x" || "o"
            if (t !== 0) {
                if (result.winPlayer === 0) result.winPlayer = t;

                if (result.winPlayer === t) {
                    result.list.push(p);
                }
            };
        }

        // check 2 cross
        if ((matrix[i][1][1] !== "") && (matrix[i][0][0] === matrix[i][1][1]) && (matrix[i][1][1] === matrix[i][2][2])) {
            if (result.winPlayer === 0) result.winPlayer = matrix[i][1][1];

            if (result.winPlayer === matrix[i][1][1]) {
                result.list.push([[i, 0, 0], [i, 1, 1], [i, 2, 2]]);
            }
        }

        if ((matrix[i][1][1] !== "") && (matrix[i][0][2] === matrix[i][1][1]) && (matrix[i][1][1] === matrix[i][2][0])) {
            if (result.winPlayer === 0) result.winPlayer = matrix[i][1][1];

            if (result.winPlayer === matrix[i][1][1]) {
                result.list.push([[i, 0, 2], [i, 1, 1], [i, 2, 0]]);
            }
        }

    }

    // for each surface (vertical)
    // check all column aka top-down col (ex (0,0,0), (1,0,0), (2,0,0)) 
    for (i = 0; i < 3; i++) {
        // check all row
        for (j = 0; j < 3; j++) {
            var t = 0;
            var p = [];

            for (k = 0; k < 3; k++) {

                item = matrix[k][i][j];
                if (item !== "" && (t == 0 || t === item)) {
                    t = item;
                    p.push([k, i, j]);
                }
                else {
                    t = 0;
                    break;
                }
            }

            // there have at least 1 row in all "x" or "o"
            // return "x" || "o"
            if (t !== 0) {
                if (result.winPlayer === 0) result.winPlayer = t;

                if (result.winPlayer === t) {
                    result.list.push(p);
                }
            }
        }

        // check 2 cross each surface
        if ((matrix[1][1][i] !== "") && (matrix[0][0][i] === matrix[1][1][i]) && (matrix[1][1][i] === matrix[2][2][i])) {
            if (result.winPlayer === 0) result.winPlayer = matrix[1][1][i];

            if (result.winPlayer === matrix[1][1][i]) {
                result.list.push([[0, 0, i], [1, 1, i], [2, 2, i]]);
            }
        }

        if ((matrix[1][1][i] !== "") && (matrix[0][2][i] === matrix[1][1][i]) && (matrix[1][1][i] === matrix[2][0][i])) {
            if (result.winPlayer === 0) result.winPlayer = matrix[1][1][i];

            if (result.winPlayer === matrix[1][1][i]) {
                result.list.push([[0, 2, i], [1, 1, i], [2, 0, i]]);
            }
        }


        // 3 duong cheo xuoi (ex 020, 121, 222)
        var t = 0;
        var p = [];

        for (k = 0; k < 3; k++) {

            item = matrix[k][i][k];
            if (item !== "" && (t == 0 || t === item)) {
                t = item;
                p.push([k, i, k]);
            }
            else {
                t = 0;
                break;
            }
        }

        // there have at least 1 row in all "x" or "o"
        // return "x" || "o"
        if (t !== 0) {
            if (result.winPlayer === 0) result.winPlayer = t;

            if (result.winPlayer === t) {
                result.list.push(p);
            }
        }

        // 3 duong cheo nguoc (ex 022, 121, 220)
        t = 0;
        p = [];

        for (k = 0; k < 3; k++) {

            item = matrix[k][i][2 - k];
            if (item !== "" && (t == 0 || t === item)) {
                t = item;
                p.push([k, i, 2 - k]);
            }
            else {
                t = 0;
                break;
            }
        }

        // there have at least 1 row in all "x" or "o"
        // return "x" || "o"
        if (t !== 0) {
            if (result.winPlayer === 0) result.winPlayer = t;

            if (result.winPlayer === t) {
                result.list.push(p);
            }
        }
    }

    // for the last cross one (ex (0,0,0), (1,1,1), (2,2,2))
    if ((matrix[1][1][1] !== "") && (matrix[0][0][0] === matrix[1][1][1]) && (matrix[1][1][1] === matrix[2][2][2])) {
        if (result.winPlayer === 0) result.winPlayer = matrix[1][1][1];

        if (result.winPlayer === matrix[1][1][1]) {
            result.list.push([[0, 0, 0], [1, 1, 1], [2, 2, 2]]);
        }
    }

    if ((matrix[1][1][1] !== "") && (matrix[0][0][2] === matrix[1][1][1]) && (matrix[1][1][1] === matrix[2][2][0])) {
        if (result.winPlayer === 0) result.winPlayer = matrix[1][1][1];

        if (result.winPlayer === matrix[1][1][1]) {
            result.list.push([[0, 0, 2], [1, 1, 1], [2, 2, 0]]);
        }
    }

    // ---

    if ((matrix[1][1][1] !== "") && (matrix[2][0][0] === matrix[1][1][1]) && (matrix[1][1][1] === matrix[0][2][2])) {
        if (result.winPlayer === 0) result.winPlayer = matrix[1][1][1];

        if (result.winPlayer === matrix[1][1][1]) {
            result.list.push([[2, 0, 0], [1, 1, 1], [0, 2, 2]]);
        }
    }

    if ((matrix[1][1][1] !== "") && (matrix[0][2][0] === matrix[1][1][1]) && (matrix[1][1][1] === matrix[2][0][2])) {
        if (result.winPlayer === 0) result.winPlayer = matrix[1][1][1];

        if (result.winPlayer === matrix[1][1][1]) {
            result.list.push([[0, 2, 0], [1, 1, 1], [2, 0, 2]]);
        }
    }

    return result;
}

function isMoveLeft(matrix) {
    var flag = false;

    matrix.forEach(surface => {
        surface.forEach(row => {
            row.forEach(c => {
                if (c === "") flag = true;
            })
        })
    });

    return flag;
}

// Evaluation Function
// this func count all possible row/column/cross way to win within player in current board state
function heuristic(board, player) {
    var i, j, k, item;
    var count = 0;

    // for each surface (hozinotal)
    for (i = 0; i < 3; i++) {

        // check all row
        for (j = 0; j < 3; j++) {
            var t = 0;

            for (k = 0; k < 3; k++) {

                item = board[i][j][k];

                if (item === "" || item === player) {
                    t = item;
                }
                else {
                    t = 0;
                    break;
                }
            }

            // there have at least 1 row in all "x" or "o"
            // return "x" || "o"
            if (t !== 0) ++count;
        }

        // check all column
        for (j = 0; j < 3; j++) {
            var t = 0;

            for (k = 0; k < 3; k++) {

                item = board[i][k][j];
                if (item === "" || item === player) {
                    t = item;
                }
                else {
                    t = 0;
                    break;
                }
            }

            // there have at least 1 row in all "x" or "o"
            // return "x" || "o"
            if (t !== 0) ++count;
        }

        // check 2 cross
        if (isEqualPlayerOrNull(player, board[i][1][1]) && isEqualPlayerOrNull(player, board[i][0][0]) && isEqualPlayerOrNull(player, board[i][2][2]))
            ++count;

        if (isEqualPlayerOrNull(player, board[i][1][1]) && isEqualPlayerOrNull(player, board[i][0][2]) && isEqualPlayerOrNull(player, board[i][2][0]))
            ++count;
    }

    // for each surface (vertical)
    // check all column aka top-down col (ex (0,0,0), (1,0,0), (2,0,0)) 
    for (i = 0; i < 3; i++) {
        // check all row
        for (j = 0; j < 3; j++) {
            var t = 0;

            for (k = 0; k < 3; k++) {

                item = board[k][i][j];
                if (item === "" || item === player) {
                    t = item;
                }
                else {
                    t = 0;
                    break;
                }
            }

            // there have at least 1 row in all "x" or "o"
            // return "x" || "o"
            if (t !== 0) ++count;
        }

        // check 2 cross each surface
        if (isEqualPlayerOrNull(player, board[1][1][i]) && isEqualPlayerOrNull(player, board[0][0][i]) && isEqualPlayerOrNull(player, board[2][2][i]))
            ++count;

        if (isEqualPlayerOrNull(player, board[1][1][i]) && isEqualPlayerOrNull(player, board[0][2][i]) && isEqualPlayerOrNull(player, board[2][0][i]))
            ++count;

        // 3 duong cheo xuoi (ex 020, 121, 222)
        var t = 0;

        for (k = 0; k < 3; k++) {

            item = board[k][i][k];
            if (item === "" || item === player) {
                t = item;
            }
            else {
                t = 0;
                break;
            }
        }

        // there have at least 1 row in all "x" or "o"
        // return "x" || "o"
        if (t !== 0) ++count;

        // 3 duong cheo nguoc (ex 022, 121, 220)
        t = 0;

        for (k = 0; k < 3; k++) {

            item = board[k][i][2 - k];
            if (item === "" || item === player) {
                t = item;
            }
            else {
                t = 0;
                break;
            }
        }

        // there have at least 1 row in all "x" or "o"
        // return "x" || "o"
        if (t !== 0) ++count;
    }

    // for the last cross one (ex (0,0,0), (1,1,1), (2,2,2))
    if (isEqualPlayerOrNull(player, board[1][1][1]) && isEqualPlayerOrNull(player, board[0][0][0]) && isEqualPlayerOrNull(player, board[2][2][2]))
        ++count;

    if (isEqualPlayerOrNull(player, board[1][1][1]) && isEqualPlayerOrNull(player, board[0][0][2]) && isEqualPlayerOrNull(player, board[2][2][0]))
        ++count;
    // ---

    if (isEqualPlayerOrNull(player, board[1][1][1]) && isEqualPlayerOrNull(player, board[2][0][0]) && isEqualPlayerOrNull(player, board[0][2][2]))
        ++count;

    if (isEqualPlayerOrNull(player, board[1][1][1]) && isEqualPlayerOrNull(player, board[0][2][0]) && isEqualPlayerOrNull(player, board[2][0][2]))
        ++count;

    return count;
}

function minimax(board, depth, isMax, playerMaxName, alpha, beta) {
    var state = checkGameState(board);

    var playerMinName = "X";
    if (playerMaxName === "X") {
        playerMinName = "O";
    }

    if (state.winPlayer !== 0) {
        //console.log("" + state + " win!");
        // a player has win
        if (state.winPlayer.toLowerCase() === playerMaxName.toLowerCase()) {
            return 100 - depth;
        }

        else {
            return -100 + depth;
        }
    }

    if (isMoveLeft(board) == false) return 0;

    // setting up max depth
    // stop the recusive with a value that will be calculated by heuristic func
    if (depth == MAX_DEPTH) {

        if (isMax) {
            return heuristic(board, playerMaxName);
        }

        else {
            return -heuristic(board, playerMinName);
        }
    }

    // If this maximizer's move 
    if (isMax) {
        var best = -INFINITY;

        // Traverse all cells
        for (var i = 0; i < 3 && alpha < beta; ++i) {
            for (var j = 0; j < 3 && alpha < beta; ++j) {
                for (var k = 0; k < 3 && alpha < beta; ++k) {
                    // if cell empty
                    // console.log("Depth: " + depth);
                    // console.log("i j k = " + i+ " " + j + " " + k);
                    // console.log(board);
                    if (board[i][j][k] === "") {

                        // Make the move
                        board[i][j][k] = playerMaxName;

                        // Call minimax recursively and choose 
                        // the maximum value 
                        var move = minimax(board, depth + 1, !isMax, playerMaxName, alpha, beta);
                        best = (best > move) ? best : move;
                        
                        alpha = (best > alpha) ? best : alpha;

                        // Undo the move 
                        board[i][j][k] = "";

                        // Alpha Beta Pruning  
                        if (beta <= alpha) break;
                    }
                }
            }
        }

        return best;
    }
    // If this minimizer's move
    else {
        var best = INFINITY;

        // Traverse all cells
        for (var i = 0; i < 3 && alpha < beta; ++i) {
            for (var j = 0; j < 3 && alpha < beta; ++j) {
                for (var k = 0; k < 3 && alpha < beta; ++k) {
                    // if cell empty
                    // console.log("Depth: " + depth);
                    // console.log("i j k = " + i + " " + j + " " + k);
                    // console.log(board);
                    if (board[i][j][k] === "") {

                        // Make the move
                        board[i][j][k] = playerMinName;

                        // Call minimax recursively and choose 
                        // the maximum value 
                        var move = minimax(board, depth + 1, !isMax, playerMaxName, alpha, beta);
                        best = (best < move) ? best : move;
                        
                        beta = (best < beta) ? best : beta;

                        // Undo the move 
                        board[i][j][k] = "";

                        // Alpha Beta Pruning (parsed into for loop condition)
                        if (beta <= alpha) break;
                    }
                }
            }
        }

        return best;
    }
}

function isEqualPlayerOrNull(player, item) {
    return (item === "" || item === player);
}