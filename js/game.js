var speed = 2;                                  //tick speed of the game
var tileCount = 20;                             //game field size in x and y 
var tileSize = 18;                              //width and height of the displayed objects 
var tileSpacing = 1;                            //margin of each element inside the game field
var headX = 10;                                 //x position of the snake head
var headY = 10;                                 //y position of the snake head 
var food = true;                                //sets if a new food is needed
var foodPosX = Math.floor(Math.random() * 20);  //x position of the first food
var foodPosY = Math.floor(Math.random() * 20);  //y position of the first food
var currentDirection = 1;                       //saves the last user input direction
var lastTickDirection = 1;                      //saves the last game tick direchtion
var gameOver = false;                           //sets game over 
var score = 0;                                  //saves the game score
var lastX = [];                                 //saves snake heads last x position for the body parts
var lastY = [];                                 //saves snake heads last y position for the body parts

const canvas = document.getElementById("canvasGame"); 
const ctx = canvas.getContext("2d");

/*
Game logic for each game tick
while checking if the gameOver variable has changed
*/
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

//clears the screen so it is only a background
function clearScreen() {

    if(gameOver == false) {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

/*
- first saves the last x and y postion in the lastX and lastY array at the first position
- changes the snake head movment to the input direction
- saves the new direction for that game tick in the lastTickDirection, so you can't switch in one tick to different
directions. 
Example: Your are moving left (so you can't go right because you would move into yourself)
but if you would press up and right all while in one game tick you could just move over yourself because if you 
would move upwards you couldn't move down so you would just "skip" the abord condition
- drawing the snake head
*/
function drawSnakeHead(direction) {

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

    ctx.fillStyle = "green";
    ctx.fillRect(headX * tileCount + tileSpacing, headY * tileCount + tileSpacing, tileSize, tileSize);
}

//drawing the snake body parts one by one for as many times you scored (scored = times eaten food)
function drawSnakeBody() {

    for (let i = 0; i < score; i++) {

        ctx.fillStyle = "orange";
        ctx.fillRect(lastX[i] * tileCount + tileSpacing, lastY[i] * tileCount + tileSpacing, tileSize, tileSize);
    }
}

/*
- checks if the the snakes head and the food is on the same postion
- if true -> the food flag will be changed so the spawnFood function will "spawn" a new food
*/
function eatingCheck() {

    if (headX == foodPosX && headY == foodPosY) {
        food = false;
        score++;
        updateScore();
    }
}

/*
- places a new food on a random x and y postion inside the game field
- changes the food flag so there is one active food on the game field
*/
function spawnFood() {

    if(food == false) {
        foodPosX = Math.floor(Math.random() * 20);
        foodPosY = Math.floor(Math.random() * 20); 

        food = true;
    }
}

//drawing the food
function drawFood() {

    ctx.fillStyle = "red";
    ctx.fillRect(foodPosX * tileCount + tileSpacing, foodPosY * tileCount + tileSpacing, tileSize, tileSize);
}

/*
- the function only gets called via the eventListener
- it checks if the user input is "allowed" for the next move so it compares the last game tick 
direction with the user input
Example: We are moving upwards but the player wants to move down (We can't move over ourself)
so it in "illegal" move
- changes the variable currentDirection for the next game tick move
*/
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

/* 
- checks if the head is in this game tick out of bounds
- if true -> changes the gameOver variable to true -> so the game will stop in the next game tick
- recoulers the snake tail beacuse of the position it checks the condition it would move for one more position
- recoulers the "mistake" where the border was hit
*/
function borderCheck() {

    if(headX == -1 || headX == 20 || headY == -1 || headY == 20) {
        gameOver = true;

        ctx.fillStyle = "orange";
        ctx.fillRect(lastX[score] * tileCount + tileSpacing, lastY[score] * tileCount + tileSpacing, tileSize, tileSize);

        
        ctx.fillStyle = "Blue";
        ctx.fillRect(lastX[0] * tileCount + tileSpacing, lastY[0] * tileCount + tileSpacing, tileSize, tileSize);

    }
}

/* 
- checks if the head is in this game tick in the same position as a body part
- if true -> changes the gameOver variable to true -> so the game will stop in the next game tick
- recoulers the snake tail beacuse of the position it checks the condition it would move for one more position
- recoulers the "mistake" where the border was hit
*/
function tailCheck() {

    for (let i = 0; i < score; i++) {
        
        if (headX == lastX[i] && headY == lastY[i]) {
            gameOver = true;

            ctx.fillStyle = "orange";
            ctx.fillRect(lastX[i+1] * tileCount + tileSpacing, lastY[i+1] * tileCount + tileSpacing, tileSize, tileSize);

            
            ctx.fillStyle = "Blue";
            ctx.fillRect(lastX[i] * tileCount + tileSpacing, lastY[i] * tileCount + tileSpacing, tileSize, tileSize);
        }
    }
}

/* 
- function is only called on user input
- resets all game start variables
- starts new game
*/
function resetGame() {

    saveHighscore(score);

    speed = 2;
    headX = 10;
    headY = 10;
    food = true;
    foodPosX = Math.floor(Math.random() * 20);
    foodPosY = Math.floor(Math.random() * 20);
    currentDirection = 1;
    gameOver = false;
    score = 0;
    lastTickDirection = 1;

    updateHighscore();
    updateScore();

    drawGame();
}

//updates the score of game
function updateScore() {

    document.getElementById("score").innerHTML = score;
}

//saves new highscore in the session storage variable "highscore"
function saveHighscore(score) {

    let highscore = sessionStorage.getItem("highscore");

    if(score > highscore) {
        sessionStorage.setItem("highscore", score);
    }
}

//updates the highscore based on the session storage
function updateHighscore() {

    let highscore = sessionStorage.getItem("highscore");

    if(highscore == null) {
        
        highscore = 0;
    }

    document.getElementById("highscore").innerHTML = highscore;
}

/* 
Event listener for moving the snake and resetting the game
*/
window.addEventListener("keydown", function(event) {

    if(event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight") {
        changeDirection(event.key);
    }
    else if(event.code == "Space") {
        resetGame();
    }
});

/*
- updates the highscore if there is already a highscore in the sesssion storage
- starts the game
*/
window.onload = function(){
    
    updateHighscore();
    updateScore();
    drawGame();
}