const canvas = document.getElementById("canvasGame"); 
const ctx = canvas.getContext("2d");

var speed = 2;
var tileCount = 20;
var tileSize = 18;
var tileSpacing = 1; 
var headX = 10;
var headY = 10;
var food = true;
var foodPosX = Math.floor(Math.random() * 20);
var foodPosY = Math.floor(Math.random() * 20);
var currentDirection = 1;
var gameOver = false;
var score = 0;
var lastX = [];
var lastY = [];
var lastTickDirection = 1;

function drawGame() {

    if(gameOver == false) {

        clearScreen();
        drawFood();
        drawSnakeHead(currentDirection);
        drawSnakeBody();
        borderCheck();
        tailCheck();
        eatingCheck();
        spawnFood();
        setTimeout(drawGame, 1000 / speed);
    }
}

function clearScreen() {

    if(gameOver == false) {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawSnakeHead(direction) {

    if(gameOver == false) {

        lastX.unshift(headX);
        lastY.unshift(headY);

        if(direction == 1) {
            headY--;
        }
        else if(direction == 2) {
            headY++;
        }
        else if(direction == 3) {
            headX--;
        }
        else if(direction == 4) {
            headX++;
        }

        lastTickDirection = direction;

    console.log("Snake: " + headX + "/" + headY);

        ctx.fillStyle = "green";
        ctx.fillRect(headX * tileCount + tileSpacing, headY * tileCount + tileSpacing, tileSize, tileSize);
    }
}

function drawSnakeBody() {

    if(gameOver == false) {

        for (let i = 0; i < score; i++) {

            ctx.fillStyle = "orange";
            ctx.fillRect(lastX[i] * tileCount + tileSpacing, lastY[i] * tileCount + tileSpacing, tileSize, tileSize);
        }
    }
}

function eatingCheck() {

    if (headX == foodPosX && headY == foodPosY) {
        food = false;
        score++;
        console.log("SCORE: " + score);
    }
}

function spawnFood() {

    if(food == false) {
        foodPosX = Math.floor(Math.random() * 20);
        foodPosY = Math.floor(Math.random() * 20); 

        console.log("Food: " + foodPosX + "/" + foodPosY);

        food = true;
    }
}

function drawFood() {

    ctx.fillStyle = "red";
    ctx.fillRect(foodPosX * tileCount + tileSpacing, foodPosY * tileCount + tileSpacing, tileSize, tileSize);
}

function changeDirection(direction) {

    if (direction == "ArrowUp" && lastTickDirection != 2) {
        currentDirection = 1;
    }
    else if(direction == "ArrowDown" && lastTickDirection != 1) {
        currentDirection = 2;
    }
    else if(direction == "ArrowLeft" && lastTickDirection != 4) {
        currentDirection = 3;
    }
    else if (direction == "ArrowRight" && lastTickDirection != 3) {
        currentDirection = 4;
    }
}

function borderCheck() {

    if(headX == -1 || headX == 20 || headY == -1 || headY == 20) {
        gameOver = true;
        console.log("Game over");


        ctx.fillStyle = "orange";
        ctx.fillRect(lastX[score] * tileCount + tileSpacing, lastY[score] * tileCount + tileSpacing, tileSize, tileSize);

        
        ctx.fillStyle = "Blue";
        ctx.fillRect(lastX[0] * tileCount + tileSpacing, lastY[0] * tileCount + tileSpacing, tileSize, tileSize);

    }
}

function tailCheck() {

    for (let i = 0; i < score; i++) {
        
        if (headX == lastX[i] && headY == lastY[i]) {
            gameOver = true;

            ctx.fillStyle = "orange";
            ctx.fillRect(lastX[i+1] * tileCount + tileSpacing, lastY[i+1] * tileCount + tileSpacing, tileSize, tileSize);

            
            ctx.fillStyle = "Blue";
            ctx.fillRect(lastX[i] * tileCount + tileSpacing, lastY[i] * tileCount + tileSpacing, tileSize, tileSize);

            console.log("Game over"); 
        }
    }
}

window.addEventListener("keydown", function(event) {

    if(event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight") {
        changeDirection(event.key);
    }  
});

drawGame();