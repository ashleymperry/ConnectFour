/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let gameOver = false;
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  /*const board = [
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0 ],
  ]; */
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Create 'htmlBoard' variable from the item in HTML w/ID of 'board'
  
  let htmlBoard = document.getElementById('board');

  // Create table elememts for top row columns
  
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.setAttribute('class', `c${currPlayer}`);
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create table elements for cells on game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // Return y position of lowest open cell in the column 
  for (let y = HEIGHT -1; y >= 0; y--){
    if(board[y][x] === null){
      return y;
    }
  }
  // Return null if no cells are open
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // Make a div and insert into correct table cell
  const gamePiece = document.createElement('div');
  const activeCell = document.getElementById(`${y}-${x}`);
  gamePiece.classList.add('piece'); 
  gamePiece.classList.add(`p${currPlayer}`); 
  gamePiece.classList.add(`drop${y+ 1}`);
  activeCell.append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
  // game end messages
  document.getElementById('player-label').innerText = msg;
  document.getElementById('game-message').innerText = 'Game over'
  gameOver = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  //no click response if game is over
  if (gameOver) {
    return;
  }
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  
  placeInTable(y, x);
  
  // update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin(y, x)) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board[0].every(cell => cell !== null)) {
    return endGame('We have a tie!');
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
  document.getElementById('column-top').setAttribute('class', `c${currPlayer}`);
  document.getElementById('player-label').innerText = `Player ${currPlayer}`;
}

/** checkForWin: check board cell-by-cell for 'does a win start here?' */

function checkForWin(y, x) {
  let gameWin = false;

  //function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    const checkCell = (y, x) => {
      return y > -1 && y < HEIGHT &&
             x > -1 && x < WIDTH &&
             board[y][x] === currPlayer;
  };

  //count like horizontal cells
    const horiz = (y, x) => {
      let count = 1;
      let fromClick = 1;
    
      //check horizontally for like cells
      let currX = x + 1; 
      while (checkCell(y, currX) && fromClick < 4) {
        count++;
        currX++;
        fromClick++;
      }

      fromClick = 1;
      currX = x - 1;
      while (checkCell(y, currX) && fromClick < 4) {
        count++;
        currX--;
        fromClick++;
      }
      return count;
    };
    //check vertically for like cells
    const vert = (y, x) => {
      let count = 1;
      let fromClick = 1;

      let currY = y - 1;
      while (checkCell(currY, x) && fromClick < 4) {
        count++;
        currY--;
        fromClick++;
      }

      fromClick = 1;
      currY = y + 1;
      while (checkCell(currY, x) && fromClick < 4) {
        count++;
        currY++;
        fromClick++;
      }
      return count;
    };
    //check diagonally- right to left
    const diagDR = (y, x) => {
      let count = 1;
      let fromClick = 1;

      let currY = y - 1;
      let currX = x + 1;
      while (checkCell(currY, currX) && fromClick < 4) {
        count++;
        currY--;
        currX++;
        fromClick++;
        console.log(count);
      }
      fromClick = 1;
      currY = y = 1;
      currX = x - 1;
      while (checkCell(currY, currX) && fromClick < 4) {
        count++;
        currY++;
        currX--;
        fromClick++;
        console.log(count);
      }
      return count;
    };

    //check diagonally- left to right
    const diagDL = (y, x) => {
      let count = 1;
      let fromClick = 1;

      let currY = y + 1;
      let currX = x + 1;
      while (checkCell(currY, currX) && fromClick < 4) {
        count++;
        currY++;
        currX++;
        fromClick++;
      }

      fromClick = 1;
      currY = y - 1;
      currX = x - 1;
      while (checkCell(currY, currX) && fromClick < 4) {
        count++;
        currY--;
        currX--;
        fromClick++;
      }

      return count;
    };

    if (horiz(y, x) > 3 || vert(y, x) > 3 ||
    diagDR(y, x) > 3 || diagDL(y, x) > 3) {
      gameWin = true;
    }

    return gameWin;

  // TODO: read and understand this code. Add comments to help you.

 /* for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; */

}

makeBoard();
makeHtmlBoard();
