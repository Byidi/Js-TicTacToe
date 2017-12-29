var board;
var score;
var player1;

var players = new Array(2);

init();
initGame(3);

function init(){
    player1 = true;
    score = new Array(3);
    for (var i = 0; i < score.length; i++) {
        score[i] = 0;
    }

    document.getElementById("configBtn").onclick = function(){
        config();
    };

    players[0] = {"name":"player1", "color":"red", "icon":"croix"};
    players[1] = {"name":"player2", "color":"blue", "icon":"rond"};
}

function initGame(boardSize){
    board  = new Array(boardSize);
    for (var i = 0; i < boardSize; i++){
        board[i] = new Array(boardSize);
    }

    for (var i = 0; i < boardSize; i++) {
        for (var j = 0; j < boardSize; j++) {
            board[i][j] = 0;
        }
    }

    drawGrid();

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

    var player = (player1)?1:2;
    document.getElementById('player').innerHTML = players[player-1]["name"]+" à toi de jouer.";
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
    console.log("Tour "+getTurn()+" : Player "+player+" ("+players[player-1]["name"]+") a joué en "+cell);
    var win = checkVictory(row, col, player);
    if(!win){
        player1 = !player1;
        player = (player1)?1:2;
        document.getElementById('player').innerHTML = players[player-1]["name"]+" à toi de jouer.";
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
        victoryBlock.innerHTML = players[winner-1]["name"]+" gagne !!!";

        var colors = [players[winner-1]["color"], "white"];
        var cmp = 0;
        var fwLoop = setInterval(function(){
            createFirework(
                colors,                 //colors array
                screen.height,          //startTop
                screen.width/9*(cmp+1), //startLeft
                screen.height/2,        //explosionTop
                screen.width/6*(cmp+1), //explosionLeft
                3,                      //circle
                100,                    //radius
                50                      //radiusInc
            );
            cmp ++;
            (cmp >= 4) ? clearInterval(fwLoop):"";
        }, 100);
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
    initGame(board.length);
}

function surrender(){
    var player = (player1)?1:2;
    console.log("joueur "+player+"("+players[player-1]["name"]+") abandonne");
    player = (!player1)?1:2;
    victory(player);
}

function printScore(){
    document.getElementById('score1').innerHTML = score[1];
    document.getElementById('score2').innerHTML = score[2];
    document.getElementById('score0').innerHTML = score[0];

    console.log("--- Score ---");
    console.log(players[0]["name"]+" : "+score[1]);
    console.log(players[1]["name"]+" : "+score[2]);
    console.log("Egalité  : "+score[0]);
    console.log("-------------");
}

function initConfig(){
    var config = document.getElementById("config");
    config.style.visibility = "visible";
    document.getElementById('p1name').value = players[0]["name"];
    document.getElementById('p2name').value = players[1]["name"];
    document.getElementById('p1color').value = players[0]["color"];
    document.getElementById('p2color').value = players[1]["color"];

    var p1icon = document.getElementsByName("p1icon");
    for (var i = 0; i < p1icon.length; i++) {
        p1icon[i].checked = false;
        if(p1icon[i].value == players[0]["icon"]){
            p1icon[i].parentElement.style.borderColor = "red";
            p1icon[i].checked = true;
        }
    }

    var p2icon = document.getElementsByName("p2icon");
    for (var i = 0; i < p2icon.length; i++) {
        p2icon[i].checked = false;
        if(p2icon[i].value == players[1]["icon"]){
            p2icon[i].parentElement.style.borderColor = "red";
            p2icon[i].checked = true;
        }
    }

    var boardSizeSelect = document.getElementById("boardsize");
    boardSizeSelect.innerHTML = "";
    for (var i = 3; i <= 20; i++) {
        var option = document.createElement("option");
        option.innerHTML = i;
        boardSizeSelect.appendChild(option);
    }

    var boardIsEmpty = true;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
                if(board[i][j] != 0){
                    boardIsEmpty = false;
                    break;
                }
        }
    }

    if(!boardIsEmpty){
        boardSizeSelect.disabled = true;
        boardSizeSelect.setAttribute("title","La grille doit être vide pour changer de taille");
    }else{
        boardSizeSelect.disabled = false;
        boardSizeSelect.setAttribute("title","");
    }

    document.getElementById("configCancel").onclick=function(){
        config.style.visibility = "hidden";
    };

    document.getElementById("configSave").onclick = function(){
        var boardSize = document.getElementById("boardsize").value;
        if(boardIsEmpty && boardSize != board.length){
            initGame(boardSize);
        }

        players[0]["name"] = document.getElementById('p1name').value;
        players[1]["name"] = document.getElementById('p2name').value;

        var p1color = document.getElementById("p1color");
        var p2color = document.getElementById("p2color");
        players[0]["color"] = p1color.options[p1color.selectedIndex].value;
        players[1]["color"] = p2color.options[p2color.selectedIndex].value;

        players[0]["icon"] = document.querySelector('input[name="p1icon"]:checked').value;
        players[1]["icon"] = document.querySelector('input[name="p2icon"]:checked').value;

        player = (player1)?1:2;
        document.getElementById('player').innerHTML = players[player-1]["name"]+" à toi de jouer.";

        var s = document.getElementsByTagName('style');
        if(s.length > 0){s[0].remove();}
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.innerHTML  = ".player1 { background-image: url('./img/"+players[0]["icon"]+".png'); } ";
        style.innerHTML  += ".player2 { background-image: url('./img/"+players[1]["icon"]+".png'); } ";
        style.innerHTML  += ".player1win { background-color: "+players[0]["color"]+"; } ";
        style.innerHTML  += ".player2win { background-color: "+players[1]["color"]+"; } ";
        head.appendChild(style);

        document.getElementById("scorep1name").innerHTML = players[0]["name"];
        document.getElementById("scorep2name").innerHTML = players[1]["name"];

        config.style.visibility = "hidden";
    }
}

function config(){
    initConfig();

    var p1icon = document.getElementsByName("p1icon");
    for (var i = 0; i < p1icon.length; i++) {
        p1icon[i].onclick = function(e){
            for (var j = 0; j < p1icon.length; j++) {
                p1icon[j].parentElement.style.borderColor = "black";
                p1icon[j].checked = false;
            }
            this.parentElement.style.borderColor = "red";
            this.checked = true;
        };
    }

    var p2icon = document.getElementsByName("p2icon");
    for (var i = 0; i < p2icon.length; i++) {
        p2icon[i].onclick = function(e){
            for (var j = 0; j < p2icon.length; j++) {
                p2icon[j].parentElement.style.borderColor = "black";
                p2icon[j].checked = false;
            }
            this.parentElement.style.borderColor = "red";
            this.checked = true;
        };
    }
}
