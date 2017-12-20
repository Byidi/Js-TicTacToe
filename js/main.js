var board = [[0,0,0],[0,0,0],[0,0,0]];
var player1 = true;

initGame();

function initGame(){
    var grid = document.getElementsByTagName('td');
    for (var i = 0; i < grid.length; i++){
        (function () {
            var cell = i;
            grid[i].classList.remove("player1", "player2");
            grid[i].onclick = function(){
                play(cell);
            };
        }());
    }
}

function play(cell){
    var col = cell % 3;
    var row = Math.floor(cell / 3);
    var player = (player1)?1:2;
    document.getElementsByTagName('td')[cell].onclick = function(){return false;};
    document.getElementsByTagName('td')[cell].classList.add("player"+player);
    board[row][col] = player;
    checkVictory(row, col, player);
    player1 = !player1;
}

function getCol(col){
    var tmpBoard = [];
    for (var i = 0; i < board.length; i++) {
        tmpBoard[i] = board[i][col];
    }
    return tmpBoard;
}

function getDiag(col, row){
    var tmpBoard = [[],[]];
    if(col == row){
        for (var i = 0; i < board.length; i++) {
            tmpBoard[0][i] = board[i][i];
        }
    }
    if(col + row == board.length - 1){
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (i + j == board[i].length-1){
                    tmpBoard[1][i] = board[i][j];
                }
            }
        }
    }
    return tmpBoard;
}

function checkVictory(row, col, player){
    var diag = getDiag(col, row);

    if(board[row].every(function(val){return val == player;})){
        for (var i = 0; i < board.length; i++) {
            var saut = row*board.length+i;
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
    }
    if(getCol(col).every(function(val){return val == player;})){
        for (var i = 0; i < board.length; i++) {
            var saut = col+board.length*i;
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
    }
    if(diag[0].length != 0 && diag[0].every(function(val){return val == player})){
        for (var i = 0; i < board.length; i++) {
            var saut = (i+i)*(board.length-Math.floor(board.length/2));
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
    }
    if(diag[1].length != 0 && diag[1].every(function(val){return val ==  player})){
        for (var i = 0; i < board.length; i++) {
            var saut = (i+1)*(board.length-1);
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
    }

    console.log(board[0][0]+"|"+board[0][1]+"|"+board[0][2]);
    console.log(board[1][0]+"|"+board[1][1]+"|"+board[1][2]);
    console.log(board[2][0]+"|"+board[2][1]+"|"+board[2][2]);
}
