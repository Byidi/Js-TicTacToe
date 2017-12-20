var board = new Array(3)
for (var i = 0; i < board.length; i++){
    board[i] = new Array(3)
}
var player1 = true;
var score = new Array();

initGame();

function initGame(){
    var grid = document.getElementsByTagName('td');
    for (var i = 0; i < grid.length; i++){
        (function () {
            var cell = i;
            grid[i].classList.remove("player1", "player2", "player1win", "player2win");
            grid[i].onclick = function(){
                play(cell);
            };
        }());
    }
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = 0;
        }
    }
    var player = (player1)?1:2;
    document.getElementById('player').innerHTML = "Joueur "+player+" à toi de jouer.";
    document.getElementById('surrender').onclick = function(){surrender(player);};
}

function play(cell){
    var col = cell % 3;
    var row = Math.floor(cell / 3);
    var player = (player1)?1:2;
    document.getElementsByTagName('td')[cell].onclick = function(){return false;};
    document.getElementsByTagName('td')[cell].classList.add("player"+player);
    board[row][col] = player;
    console.log("Tour "+getTurn()+" : Player "+player+" a joué en "+cell);
    var win = checkVictory(row, col, player);
    if(!win){
        player1 = !player1;
        player = (player1)?1:2;
        document.getElementById('player').innerHTML = "Joueur "+player+" à toi de jouer.";
    }
}

function getTurn(){
    var cmp = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if(board[i][j] != 0){
                cmp++;
            }
        }
    }
    return cmp;
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
    var win = false;

    if(board[row].every(function(val){return val == player;})){
        for (var i = 0; i < board.length; i++) {
            var saut = row*board.length+i;
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
        win = true;
    }
    if(getCol(col).every(function(val){return val == player;})){
        for (var i = 0; i < board.length; i++) {
            var saut = col+board.length*i;
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
        win = true;
    }
    if(diag[0].length != 0 && diag[0].every(function(val){return val == player})){
        for (var i = 0; i < board.length; i++) {
            var saut = (i+i)*(board.length-Math.floor(board.length/2));
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
        win = true;
    }
    if(diag[1].length != 0 && diag[1].every(function(val){return val ==  player})){
        for (var i = 0; i < board.length; i++) {
            var saut = (i+1)*(board.length-1);
            document.getElementsByTagName('td')[saut].classList.add("player"+player+"win");
        }
        win = true;
    }

    if(win){
        victory(player);
    }

    console.log(board[0][0]+"|"+board[0][1]+"|"+board[0][2]);
    console.log(board[1][0]+"|"+board[1][1]+"|"+board[1][2]);
    console.log(board[2][0]+"|"+board[2][1]+"|"+board[2][2]);

    return win;
}

function victory(winner){
    score.push(winner);

    var grid = document.getElementsByTagName('td');
    for (var i = 0; i < grid.length; i++) {
        grid[i].onclick = function(){return false;};
    }

    document.getElementById('player').innerHTML = "";

    var victoryBlock = document.getElementById('victory');
    victoryBlock.style.opacity = "1";
    victoryBlock.style.width = "80%";
    victoryBlock.style.height = "200px";
    victoryBlock.style.lineHeight = "200px";
    victoryBlock.style.top = "50%";
    victoryBlock.style.left = "50%";
    victoryBlock.innerHTML = "Joueur "+winner+" gagne !!!";

    victoryBlock.onclick = function(e){
        document.getElementById('victory').removeAttribute('style');

        document.getElementById('replay').style.display = "block";
        document.getElementById('replay').onclick = function(e){
            this.removeAttribute('style');
            replay();
        };
    };

}

function replay(){
    player1 = !player1;
    initGame();
}

function surrender(){
    console.log("surrender");
}
