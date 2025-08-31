const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9*box, y: 10*box }];
let food = { x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box };
let score = 0;
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;
let direction;
let gameSpeed = 80; // snake speed in ms
let game;

// Common function to set direction
function setDirection(newDir){
    if(newDir==="LEFT" && direction!=="RIGHT") direction="LEFT";
    else if(newDir==="RIGHT" && direction!=="LEFT") direction="RIGHT";
    else if(newDir==="UP" && direction!=="DOWN") direction="UP";
    else if(newDir==="DOWN" && direction!=="UP") direction="DOWN";
}

// Desktop arrow keys
document.addEventListener("keydown", e => {
    if(e.key.startsWith("Arrow")) setDirection(e.key.replace("Arrow","").toUpperCase());
});

// Mobile buttons
document.getElementById("up").addEventListener("click", ()=>setDirection("UP"));
document.getElementById("down").addEventListener("click", ()=>setDirection("DOWN"));
document.getElementById("left").addEventListener("click", ()=>setDirection("LEFT"));
document.getElementById("right").addEventListener("click", ()=>setDirection("RIGHT"));

// Mobile swipe support
let touchStartX=0, touchStartY=0;
canvas.addEventListener("touchstart", e => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
});
canvas.addEventListener("touchend", e => {
    const t = e.changedTouches[0];
    let dx = t.clientX - touchStartX;
    let dy = t.clientY - touchStartY;

    if(Math.abs(dx) > Math.abs(dy)){
        if(dx > 0) setDirection("RIGHT");
        else setDirection("LEFT");
    } else {
        if(dy > 0) setDirection("DOWN");
        else setDirection("UP");
    }
});

// Draw function
function draw(){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,400,400);

    // Draw snake
    for(let i=0;i<snake.length;i++){
        ctx.fillStyle=i===0?"green":"white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle="red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(direction==="LEFT") snakeX-=box;
    if(direction==="RIGHT") snakeX+=box;
    if(direction==="UP") snakeY-=box;
    if(direction==="DOWN") snakeY+=box;

    // Eat food
    if(snakeX===food.x && snakeY===food.y){
        score+=10;
        food={ x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box };
        let tail = snake[snake.length-1];
        snake.push({ x: tail.x, y: tail.y });
    } else snake.pop();

    let newHead={x:snakeX, y:snakeY};

    // Collision with wall or self
    if(snakeX<0 || snakeY<0 || snakeX>=canvas.width || snakeY>=canvas.height || collision(newHead,snake)){
        clearInterval(game);
        alert("Game Over! Score: "+score);
        if(score>highScore){ highScore=score; localStorage.setItem("highScore", highScore); }
        score=0;
        snake=[{x:9*box, y:10*box}];
        direction=undefined;
        game=setInterval(draw, gameSpeed);
        return;
    }

    snake.unshift(newHead);

    // Score display
    ctx.fillStyle="white";
    ctx.font="20px Arial";
    ctx.fillText("Score: "+score,10,20);
    ctx.fillText("High Score: "+highScore,250,20);
}

// Collision detection
function collision(head,array){
    for(let i=1;i<array.length;i++){
        if(head.x===array[i].x && head.y===array[i].y) return true;
    }
    return false;
}

// Start game
game = setInterval(draw, gameSpeed);
