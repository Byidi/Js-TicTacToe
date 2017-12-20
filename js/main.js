var board = [[0,0,0],[0,0,0],[0,0,0]];
var player1 = true;

initGame();

function play(zone){
    var row = zone % 3;
    var col = Math.floor(zone / 3);
    console.log(player1 +"=> "+col+"/"+row);
    document.getElementsByTagName('td')[zone].onclick = function(){return false;};
}

function initGame(){
    var grid = document.getElementsByTagName('td');
    for (var i = 0; i < grid.length; i++) {
        (function () {
            var zone = i;
            grid[i].onclick = function(){
                play(zone);
            };
        }());
    }
}
