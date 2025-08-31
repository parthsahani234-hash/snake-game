const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const msgDiv = document.getElementById("gameOverMessage");

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
let score = 0;
let highScore = 0;
let d;
let game;
let gameSpeed = 150;
let gameOver = false;

// Touch variables
let touchStartX = 0, touchStartY = 0;

// Load high score
if(localStorage.getItem("highScore")) highScore = parseInt(localStorage.getItem("highScore"));

// Keyboard controls
document.addEventListener("keydown", function(event){
    if(event.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    else if(event.key === "ArrowUp" && d !== "DOWN") d = "UP";
    else if(event.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    else if(event.key === "ArrowDown" && d !== "UP") d = "DOWN";
});

// Mobile swipe controls
canvas.addEventListener("touchstart", function(e){
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchend", function(e){
    e.preventDefault();
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;

    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if(Math.abs(dx) > Math.abs(dy)){
        if(dx > 0 && d !== "LEFT") d = "RIGHT";
        else if(dx < 0 && d !== "RIGHT") d = "LEFT";
    } else {
        if(dy > 0 && d !== "UP") d = "DOWN";
        else if(dy < 0 && d !== "DOWN") d = "UP";
    }
}, { passive: false });

function draw(){
    if(gameOver) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    // Draw snake
    for(let i=0; i<snake.length; i++){
        ctx.fillStyle = i===0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d === "LEFT") snakeX -= box;
    if(d === "UP") snakeY -= box;
    if(d === "RIGHT") snakeX += box;
    if(d === "DOWN") snakeY += box;

    // Eat food
    if(snakeX === food.x && snakeY === food.y){
        score += 10;
        food = { x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box };
        snake.push({});
    } else {
        snake.pop();
    }

    let newHead = {x: snakeX, y: snakeY};

    // Collision
    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)){
        gameOver = true;
        clearInterval(game);

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        msgDiv.style.display = "block";
        msgDiv.innerHTML = `Game Over! Score: ${score}<br>Click to Restart`;

        msgDiv.onclick = () => {
            msgDiv.style.display = "none";
            startGame();
        };

        return;
    }

    snake.unshift(newHead);

    // Score display
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: "+score, 10, 20);
    ctx.fillText("High Score: "+highScore, 250, 20);
}

function collision(head, array){
    for(let i=1; i<array.length; i++){
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function startGame(){
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    d = undefined;
    gameOver = false;
    clearInterval(game);
    game = setInterval(draw, gameSpeed);
}

// Initial start
startGame();
