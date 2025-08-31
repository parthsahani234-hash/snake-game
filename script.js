const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
let score = 0;
let highScore = 0;
let d;
let moveStep = 20; // snake movement per frame
let gameSpeed = 230; // ms delay for game loop

// Load high score from localStorage
if(localStorage.getItem("highScore")) highScore = parseInt(localStorage.getItem("highScore"));

// Arrow key controls
document.addEventListener("keydown", function(event){
    if(event.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    else if(event.key === "ArrowUp" && d !== "DOWN") d = "UP";
    else if(event.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    else if(event.key === "ArrowDown" && d !== "UP") d = "DOWN";
});

// Mobile swipe controls
let touchStartX, touchStartY;
canvas.addEventListener("touchstart", function(e){
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, false);

canvas.addEventListener("touchend", function(e){
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
}, false);

// Draw function
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    // Draw snake
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d === "LEFT") snakeX -= moveStep;
    if(d === "UP") snakeY -= moveStep;
    if(d === "RIGHT") snakeX += moveStep;
    if(d === "DOWN") snakeY += moveStep;

    // Eat food
    if(snakeX === food.x && snakeY === food.y){
        score += 10;
        food = { x: Math.floor(Math.random()*19)*box, y: Math.floor(Math.random()*19)*box };
        snake.push({});
    } else {
        snake.pop();
    }

    let newHead = {x: snakeX, y: snakeY};

    // Collision check
    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)){
        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        alert("Game Over! Your Score: " + score);
        // Reset game
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box }];
        d = undefined;
        food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
    }

    snake.unshift(newHead);

    // Display score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("High Score: " + highScore, 250, 20);

    // Loop
    setTimeout(() => {
        requestAnimationFrame(draw);
    }, gameSpeed);
}

// Collision function
function collision(head, array){
    for(let i = 1; i < array.length; i++){
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Start game
draw();
