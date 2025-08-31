const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box,
};
let score = 0;
let highScore = 0;
let d;

// Load high score from local storage (optional)
if(localStorage.getItem("highScore")){
    highScore = parseInt(localStorage.getItem("highScore"));
}

document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode === 37 && d !== "RIGHT") d = "LEFT";
  else if (event.keyCode === 38 && d !== "DOWN") d = "UP";
  else if (event.keyCode === 39 && d !== "LEFT") d = "RIGHT";
  else if (event.keyCode === 40 && d !== "UP") d = "DOWN";
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 400, 400);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d === "LEFT") snakeX -= box;
  if (d === "UP") snakeY -= box;
  if (d === "RIGHT") snakeX += box;
  if (d === "DOWN") snakeY += box;

  if (snakeX === food.x && snakeY === food.y) {
    score += 10; // har food par 10 points
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box,
    };
    snake.push({}); // add new segment
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Game over
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    alert("Game Over! Your Score: " + score);
    if(score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    // Reset game
    score = 0;
    snake = [{ x: 9 * box, y: 10 * box }];
    d = undefined;
  }

  snake.unshift(newHead);

  // Display score and high score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High Score: " + highScore, 250, 20);
}

function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

let game = setInterval(draw, 100);

