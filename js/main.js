var board;
var score;
var player1;

init();
initGame();

function init(){
    var boardSize = 3;
    board  = new Array(boardSize);
    for (var i = 0; i < board.length; i++){
        board[i] = new Array(boardSize);
    }
    score = new Array(3);

    player1 = true;
    for (var i = 0; i < score.length; i++) {
        score[i] = 0;
    }

    drawGrid();
}

function initGame(){
    var grid = document.getElementById("board").getElementsByTagName('td');
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
    document.getElementById('surrender').onclick = function(e){
        var surrenderMsg = document.createElement("p");
        surrenderMsg.innerHTML = "Double click pour abandonner";
        document.getElementById('surrender').appendChild(surrenderMsg);
        setTimeout(function(){surrenderMsg.remove();},1000);
    };
    document.getElementById('surrender').ondblclick = function(){surrender();};

    if(score.length > 0){
        printScore();
    }
}

function drawGrid(){
    var grid = "";
    for (var i = 0; i < board.length; i++) {
        grid += "<tr>";
        for (var j = 0; j < board[i].length; j++) {
            grid += "<td></td>";
        }
        grid += "</tr>";
    }
    var table = document.getElementById("board");
    table.style.height = table.offsetWidth+"px";
    var tableTd = table.getElementsByTagName("td");
    table.innerHTML = grid;
    var size = 100/board.length;

    for (var i = 0; i < tableTd.length; i++) {
        tableTd[i].style.width = ""+size+"%";
        tableTd[i].style.height = ""+size+"%";
    }
}

function play(cell){
    var col = cell % board.length;
    var row = Math.floor(cell / board.length);
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
            var saut = i*(board.length+1);
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

    var draw = true;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if(board[i][j] == 0){
                draw = false;
                break;
            }
        }
    }

    if(win){
        victory(player);
    }else if(draw){
        victory(0);
    }

    var boardLog = "";
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if(j != board.length-1){
                boardLog += board[i][j]+"|";
            }else{
                boardLog += board[i][j]+"\n";
            }
        }
    }
    console.log(boardLog);

    return win;
}

function victory(winner){
    score[winner]++;

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

    if(winner == 0){
        victoryBlock.innerHTML = "Egalité";
    }else{
        victoryBlock.innerHTML = "Joueur "+winner+" gagne !!!";
        if(winner == 1){
            var colors = ["red", "crimson", "darkred", "firebrick"];
        }else{
            var colors = ["blue", "darkblue", "navy", "aqua"];
        }
        var cmp = 0;
        var fwLoop = setInterval(function(){
            createFirework(colors, screen.height/cmp , 0, screen.height/2, screen.width/2, 9, 100, 50);
            cmp ++;
            (cmp >= 3) ? clearInterval(fwLoop):"";
        }, 1500);
    }


    victoryBlock.onclick = function(e){
        document.getElementById('victory').removeAttribute('style');
        document.getElementById('player').innerHTML = "";

        document.getElementById('replay').style.display = "block";
        printScore();
        document.getElementById('replay').onclick = function(e){
            this.removeAttribute('style');
            replay();
        };
    };

}

function getRadians(degrees){
  return degrees * Math.PI / 180;
};

function createFirework(colors, startTop, startLeft, explosionTop, explosionLeft, circle, radius, radiusInc){
    var id = "fw_"+new Date().getTime();
    var body = document.getElementsByTagName('body')[0];
    var f = new Array(20);
    //Create fireworks
    for (var i = 0; i < 36*circle; i++){
        f[i] = document.createElement("div");
        body.appendChild(f[i]);
        f[i].classList.add("fireworks");
        f[i].classList.add(id);
        var randColor = Math.floor((Math.random() * colors.length));
        f[i].style.backgroundColor = colors[randColor];
        f[i].style.top = startTop+"px";
        f[i].style.left = startLeft+"px";
        f[i].style.opacity = "1";
        f[i].style.transition = "top 1s, left 1s, opacity 2s";
    }
    //Launch fireworks
    setTimeout(function(){
        var fireworks = document.getElementsByClassName(id);
        for (var i = 0; i < fireworks.length; i++) {
            fireworks[i].style.top = explosionTop+"px";
            fireworks[i].style.left = explosionLeft+"px";
        }
    },1);
    //Explode fireworks
    setTimeout(function(){
        var fireworks = document.getElementsByClassName(id);

        var rayon = 100;
        var angle = 0;
        for (var i = 0; i < fireworks.length; i++) {
            var x = radius * Math.cos(getRadians(angle));
            var y = radius * Math.sin(getRadians(angle));
            fireworks[i].style.top = fireworks[i].offsetTop+y+"px"
            fireworks[i].style.left = fireworks[i].offsetLeft+x+"px";
            fireworks[i].style.opacity = 0;
            angle += 10;
            if(angle >= 360){
                radius += radiusInc;
                angle = 0;
            }
        }
    },1000);
    /*
    setTimeout(function(){
        var fireworks = document.getElementsByClassName('fireworks');
        var x = 0;
        var y = 100;
        for (var i = 0; i < fireworks.length; i++) {
            fireworks[i].style.top = fireworks[i].offsetTop-y+"px"
            fireworks[i].style.left = fireworks[i].offsetLeft+x+"px";
            if(i < 10){
                x+=10; y-=10;
            }else if (i>=10 && i < 20) {
                x-=10; y-=10;
            }else if (i>=20 && i < 30) {
                x-=10; y+=10;
            }else if (i>=30 && i < 40) {
                x+=10; y+=10;
            }
            fireworks[i].style.opacity = 0;
        }
    },1000);*/
}

function replay(){
    player1 = !player1;
    initGame();
}

function surrender(){
    var player = (player1)?1:2;
    console.log("joueur "+player+" abandonne");
    player = (!player1)?1:2;
    victory(player);
}

function printScore(){
    document.getElementById('score1').innerHTML = score[1];
    document.getElementById('score2').innerHTML = score[2];
    document.getElementById('score0').innerHTML = score[0];

    console.log("--- Score ---");
    console.log("Joueur 1 : "+score[1]);
    console.log("Joueur 2 : "+score[2]);
    console.log("Egalité  : "+score[0]);
    console.log("-------------");
}
