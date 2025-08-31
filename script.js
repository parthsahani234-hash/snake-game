const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let box = 20;
let snake;
let food;
let score;
let d;
let game;

function init() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box,
  };
  score = 0;
  d = null;
  clearInterval(game);
  game = setInterval(draw, 150); // ⏳ ab thoda slow speed
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
    score += 10; // ⭐ ab har bar +10
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Game over conditions
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    setTimeout(() => {
      if (confirm("Game Over! Your Score: " + score + "\nRestart?")) {
        init(); // restart game
      }
    }, 100);
    return;
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

init();
