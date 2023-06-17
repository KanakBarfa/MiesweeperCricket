let boardSize = 0;
let fielderCount = 0;
let board = [];
let gameOver = false;
let score = 0;
let revealedRuns = [];
var diff=0;
var probabilities=[]
var soundButton = document.getElementById("soundButton");
var mute=0;
function muute(){ // mute the audio if player wants
  if (mute==0) {
    mute=1;
    soundButton = document.getElementById("soundButton");
    soundButton.textContent="Unmute";
  } else {
    mute=0;
    soundButton = document.getElementById("soundButton");
    soundButton.textContent="Mute";
  }
}

function getRevealedCellCount() {
  let count = 0;
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j].isRevealed) {
        count++;
      }
    }
  }
  return count;
}
function createBoard() {
  board = new Array(boardSize);
  for (let i = 0; i < boardSize; i++) {
    board[i] = new Array(boardSize);
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = {
        isFielder: false,
        isRevealed: false,
        isEmpty: true
      };
    }
  }
  let count = 0;
  while (count < fielderCount) {
    let i = Math.floor(Math.random() * parseFloat(boardSize));
    let j = Math.floor(Math.random() * parseFloat(boardSize));
    if (!board[i][j].isFielder && i < boardSize && j < boardSize) {
      board[i][j] = {
        isFielder: true,
        isRevealed: false,
        isEmpty: true
      };
      count++;
    }
  }
}

function startGame() {
  revealedRuns=[];
  document.getElementById('mineboard').hidden = false;
  boardSize = parseInt(document.getElementById('boardSize').value);
  fielderCount = parseInt(document.getElementById('fielderCount').value);
  // Ensure that the fielder count is not greater than or equal to the board size
  if (fielderCount >= boardSize * boardSize) {
    alert('Fielder count cannot be greater than or equal to board size.');
    return;
  }
  diff = document.getElementById('mode').value;
  createBoard();
  gameOver = false;
  score = 0;
  updateScore();
  drawBoard();
}
function generateRun() { // used to generate runs randomly from the array based on difficulty
  if (diff==0){probabilities = [1, 2, 4,4,4, 4,6, 6, 6]; }
  else if (diff==1){ probabilities = [1,1,1,2,2,4,4,6];}
  else if (diff==2){ probabilities = [1,1,1,1,2,2,4,6]; }
  else if (diff==3){ probabilities = [0,0,0,1,1,1,1,1,2,2,4,4,6]; }
  else if (diff==4){ probabilities = [0,0,0,0,1,1,1,1,1,1,2,2,2,2,4,4,6]; }
  const randomIndex = Math.floor(Math.random() * probabilities.length);
  return probabilities[randomIndex];
}


function drawBoard() {
  let gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML='';
  let table = document.createElement('table');

  // Initialize revealedRuns array if it's empty
  if (revealedRuns.length === 0) {
    for (let i = 0; i < boardSize; i++) {
      revealedRuns[i] = new Array(boardSize);
    }
  }

  for (let i = 0; i < boardSize; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < boardSize; j++) {
      let cell = document.createElement('td');
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      cell.addEventListener('click', function () {
        revealCell(i, j);
        hovering();
      });
      cell.addEventListener('mouseover', function () {
        var audio = new Audio();
        audio.src = "./mixkit-retro-arcade-casino-notification-211.wav";
        if(mute==0){audio.play();}
        cell.style.width='36px';
        cell.style.height='36px';
        cell.style.border = '2px solid rgba(255, 255, 255, 255)';
      });
      cell.addEventListener('mouseout', function () {
        cell.style.border = '1px solid gray';
        cell.style.width='40px';
        cell.style.height='40px';
      });
      if (board[i][j].isRevealed) {
        if (!board[i][j].isFielder){
          if (revealedRuns[i][j] === undefined) {
            revealedRuns[i][j] = generateRun(); // Generate a random number of runs from 1 to 6
            score += revealedRuns[i][j]; // Increase the score by the runs
          }
          cell.textContent = revealedRuns[i][j];
          board[i][j].isEmpty = false;
          cell.classList.add('revealed');
        }
        
      }
      if (gameOver){
        if (board[i][j].isFielder){
          cell.classList.add('fielder');
        }
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  gameBoard.appendChild(table);
  updateScore(); // Update the score after revealing the cells
}

function revealCell(row, col) {
  if (gameOver || board[row][col].isRevealed) {
    document.getElementById('hscore').textContent = Math.max(score, document.getElementById('hscore').textContent);
    drawBoard();
    return;
  }
  if (board[row][col].isFielder) {
    board[row][col].isRevealed = true;
    gameOver = true;
    drawBoard();
    setTimeout(function(){
      alert('Game over! Your score: ' + score + ' runs');
    },500)
  } else {
    board[row][col].isRevealed = true;
    if (revealedRuns[row][col] === undefined) {
      updateScore();
    }
    drawBoard();
    if (board[row][col].isEmpty) {
      updateScore();
    } else {
      updateScore();
    }
    if (getRevealedCellCount() === boardSize * boardSize - fielderCount) {
      var win = new Audio('./mixkit-completion-of-a-level-2063.wav');
      if(mute==0){win.play();}
      gameOver = true;
      setTimeout(function() {
        alert('You win! You scored ' + score + ' runs');
      }, 500); // delay alert by 0.5 second (500 milliseconds)
    }
    
  }
}

function updateScore() {
  document.getElementById('score').textContent = score;
  document.getElementById('hscore').textContent = Math.max(score, document.getElementById('hscore').textContent);
}
function hovering(){
  var start=new Audio('./mixkit-arcade-mechanical-bling-210.wav');
  if(mute==0){start.play();}
}
createBoard();
drawBoard();