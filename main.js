const COLS = 10;
const ROWS = 20;
const CELL = 25

const fig = {
    'I': [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J': [
        [1,0,0],
        [1,1,1],
        [0,0,0],
    ],
    'L': [
        [0,0,1],
        [1,1,1],
        [0,0,0],
    ],
    'O': [
        [1,1],
        [1,1],
    ],
    'S': [
        [0,1,1],
        [1,1,0],
        [0,0,0],
    ],
    'Z': [
        [1,1,0],
        [0,1,1],
        [0,0,0],
    ],
    'T': [
        [0,1,0],
        [1,1,1],
        [0,0,0],
    ]
};

const color = {
    'I': 'blue',
    'J': 'yellow',
    'L': 'green',
    'O': 'purple',
    'S': 'red',
    'Z': 'orange',
    'T': 'brown'
};

const levels = {
    1: 1000,
    2: 900,
    3: 800,
    4: 700,
    5: 600,
    6: 500,
    7: 450,
    8: 400
};

let map = [];
let score = 0;
let counter = 0;
let level = 1;
let inter = levels[level];
let gameOver = false;
let interval;
let username = localStorage["gamer_name"];
const field = document.getElementById('field');
const ctx = field.getContext('2d');
const lead_table = document.getElementById("table");
lead_table.close();

for (let y = -2; y < 20; y++) {
    map[y] = [];

    for (let x = 0; x < 10; x++) {
        map[y][x] = 0;
    }
}
function randInt(first, last){
   return Math.floor(Math.random() * (last-first+1)) + first;
}
function nextTetromino(){
    const figures = ['I', 'J', 'L', 'S', 'Z', 'O', 'T'];
    const num = randInt(0, 6);
    const lit = figures[num]
    const next = document.getElementById('next');
    const ctxn = next.getContext('2d');
    ctxn.clearRect(0,0,next.width,next.height);
    for(let yn = 0; yn < fig[lit].length; yn++){
        for(xn = 0; xn < fig[lit][0].length; xn++){
            if(fig[lit][yn][xn] != 0) {
                ctxn.fillStyle = color[lit]
                ctxn.fillRect((150 - 25*fig[lit].length)/2 + xn * CELL, (150 - 25*fig[lit][0].length)/2 + yn * CELL, CELL - 1, CELL - 1)
            }
        }
    }
    return{
        name: lit,
        matrix: fig[lit]
    };
}

let next_tetromino = nextTetromino()

function newTetromino(){
    const nm = next_tetromino.name
    const mtr = next_tetromino.matrix
    const column = map[0].length/2 - Math.ceil(mtr[0].length/2);
    const row = nm === 'I' ? -1 : -2;
    next_tetromino = nextTetromino()
    return {
        name: nm,
        matrix: mtr,
        row: row,
        col: column
    };
}

let cur_tetromino = newTetromino()

function rot(matrix){
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix[0].length; j++) {
            result[i][j] = matrix[j][matrix.length - i - 1];
        }
    }
    return result;
}

function canBeMoved(matrix, x, y){
    for(let ty = 0; ty < matrix.length; ty++){
        for(let tx = 0; tx < matrix[0].length; tx++){
            if(matrix[ty][tx] != 0 && (x+tx < 0 || x+tx >= map[0].length || y+ty >= map.length || map[ty+y][tx+x] != 0)){
                return false;
            }
        }
    }
    return true
}

function showGameOver() {
    gameOver = true;
    let lead;
    if(localStorage.hasOwnProperty('leaders')){
        lead = JSON.parse(localStorage.getItem("leaders"));
        lead.push({user: username, score: score});
        lead.sort(function (a,b) {
            return b.score - a.score;
        });
        while(lead.length>10){
            lead.pop();
        }
        localStorage.setItem('leaders',JSON.stringify(lead));
    }else{
        lead = [];
        lead.push({name:name,score: score});
        localStorage.setItem('leaders',JSON.stringify(lead));
    }
    let array = '<ol>';
    for( var i = 0; i < lead.length; i++ ){
        array += '<li>';
        array += lead[i].user + " - ";
        array += lead[i].score;
        array += '</li>';
    }
    array += '</ol>';
    document.getElementById("table").innerHTML = "Таблица лидеров\n" + array;
    lead_table.showModal();
}


function draw(){
    ctx.clearRect(0,0,field.width,field.height);
    for(let y = 0; y < 20; y++){
        for(let x = 0; x < 10; x++){
            if(map[y][x] != 0){
                ctx.fillStyle = color[map[y][x]];
                ctx.fillRect(x*CELL, y*CELL, CELL-1, CELL-1);
            }
        }
    }
    ctx.fillStyle = color[cur_tetromino.name];
    for(let y = 0; y < cur_tetromino.matrix.length; y++){
        for(let x = 0; x < cur_tetromino.matrix[0].length; x++){
            if(cur_tetromino.matrix[y][x] != 0){
                ctx.fillRect((cur_tetromino.col+x)*CELL, (cur_tetromino.row+y)*CELL, CELL-1, CELL-1);
            }
        }
    }
}

function setTetromino(){
    for(let y = 0; y < cur_tetromino.matrix.length; y++){
        for(let x = 0; x < cur_tetromino.matrix[0].length; x++){
            if(cur_tetromino.matrix[y][x] != 0){
                if(cur_tetromino.row+y < 0){
                    gameOver = true;
                    return;
                }
                map[cur_tetromino.row+y][cur_tetromino.col+x] = cur_tetromino.name
            }
        }
    }
    let row = map.length - 1
    while(row >= 0){
        if(map[row].every(cur => cur != 0)){
            for (let y = row; y >= 0; y--) {
                for (let x = 0; x < map[y].length; x++) {
                    map[y][x] = map[y-1][x];
                }
            }
            score++;
            counter++;
            document.getElementById("score").innerHTML =  score;
            if(counter == 1){
                level++;
                if(level > 8){
                    level = 8;
                }
                counter = 0;
                document.getElementById("level").innerHTML =  level;
            }
        }
        else{
            row--;
        }
    }
    cur_tetromino = newTetromino();
    clearInterval(interval);
    interval = setInterval(autoMove, levels[level]);
}

function autoMove(){
    let row = cur_tetromino.row + 1
    if(!canBeMoved(cur_tetromino.matrix, cur_tetromino.col, row)){
        setTetromino();
        if(gameOver){
            clearInterval(interval);
            showGameOver();
            return;
        }
    }
    else{
        cur_tetromino.row = row;
    }
    draw();
}

document.addEventListener('keydown', function(event) {
    if (event.which === 37 || event.which === 39) {
        let col = 0;
        if(event.which === 37){
            col = cur_tetromino.col - 1;
        }
        else{
            col = cur_tetromino.col + 1;
        }
        if(canBeMoved(cur_tetromino.matrix, col, cur_tetromino.row)) {
            cur_tetromino.col = col;
            draw();
        }
    }
    if (event.which === 38) {
        const matrix = rot(cur_tetromino.matrix);
        if (canBeMoved(matrix, cur_tetromino.col, cur_tetromino.row)) {
            cur_tetromino.matrix = matrix;
            draw();
        }
    }
    if(event.which === 40) {
        const row = cur_tetromino.row + 1;
        if(!canBeMoved(cur_tetromino.matrix, cur_tetromino.col, row)){
            setTetromino();
            draw();
            return;
        }
        else{
            cur_tetromino.row++;
            draw();
        }
    }
});

function start(){
    if(interval) {
        clearInterval(interval)
    }
    interval = setInterval(autoMove, levels[level])
}