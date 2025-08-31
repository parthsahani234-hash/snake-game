const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * 19) * box, y: Math.floor(Math.random() * 19) * box };
let score = 0;
let highScore = 0;
let d;
let game;

// Load high score from local storage
if(localStorage.getItem("highScore")) highScore = parseInt(localStorage.getItem("highScore"));

// Arrow key controls
document.addEventListener("keydown", function(event){
    if(event.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    else if(event.key === "ArrowUp" && d !== "DOWN") d = "UP";
    else if(event.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    else if(event.key === "ArrowDown" && d !== "UP") d = "DOWN";
});

// Draw function
function draw(){
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

    // Collision with wall or self
    if(snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)){
        clearInterval(game); 
        alert("Game Over! Your Score: "+score);

        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }

        // Reset game
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box }];
        d = undefined;

        game = setInterval(draw, 100); // restart game
        return; // important to stop further execution
    }

    snake.unshift(newHead);

    // Display score and high score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: "+score, 10, 20);
    ctx.fillText("High Score: "+highScore, 250, 20);
}

// Collision check function
function collision(head, array){
    for(let i=1; i<array.length; i++){
        if(head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Start game
game = setInterval(draw, 100);
