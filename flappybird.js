//board
let board;
let boardwidth =360;
let boardheight = 640;
let context;

let birdwidth = 34;
let birdheight = 24;
let birdX = boardwidth/8;
let birdY = boardheight/2;
let birdimg;

let bird = {
    x : birdX,
    y : birdY,
    width :birdwidth,
    height : birdheight

}
//pipes
let pipeArray =[];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score =0;

let wingSound = new Audio("./sfx_wing.wav");
let hitSound = new Audio("./sfx_hit.wav");
let bgm = new Audio("./bgm_mario.mp3");
bgm.loop = true;
let pointSound = new Audio("./sfx_point.wav");
let dieSound = new Audio("./sfx_die.wav");

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    //load img
    birdimg = new Image();
    birdimg.src = "./flappybird.png";
    birdimg.onload = function() {
        context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src ="./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown",moveBird);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    
    if(bird.y > board.height){
        gameOver = true;
        dieSound.play();
    }
    //pipes
    for(let i =0;i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x >pipe.x +pipe.width){
            score += 0.5;
            pointSound.play();
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)){
            hitSound.play();
            gameOver = true;
        }
    }
    while  (pipeArray.length >0 && pipeArray[0].x <0 - pipewidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
        bgm.pause();
        bgm.currentTime =0;
    }
}

function placePipes() {
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeheight/4 -Math.random()*(pipeheight/2);
    let openSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width: pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img :bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeheight + openSpace,
        width : pipewidth,
        height : pipeheight,
        passed :false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        if(bgm.paused){
            bgm.play();
        }
        wingSound.play();
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return (a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y);
}