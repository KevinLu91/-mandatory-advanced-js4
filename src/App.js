import React, {useReducer, useState} from 'react';
import './App.css';
import BoardCell from './BoardCell';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const initialBoard = new Array(7 * 6).fill(null);

const initialState = {
  cell: initialBoard,
  player: 'yellow',
  gameOver: false,
  winner: null,
};

function findLowestIndex(cells, placementIndex) {
  const column = placementIndex % 7;
  let index = 7 * 5 + column;

  while (index >= 0) {
    if (cells[index] === null) {
      break;
    }
    index -= 7;
  }

  return index;
}

function reducer(state, action) {
  switch (action.type) {
    case 'fill_cell':
      const newCell = [...state.cell];
      const index = findLowestIndex(newCell, action.placementIndex);
      if (state.gameOver) {
        return {
          ...state,
        };
      }
      if (index >= 0) {
        newCell[index] = action.playerTurn;
        return {
          ...state,
          cell: newCell,
          player: action.playerTurn
        };
      }
      else {
        return state;
      }
    case 'newGame':
      return initialState;

    default:
      return state;
  }
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  function checkWinner() {
    let gameBoard = state.cell;

    //check winner row
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 7 - 3; x++) {

        const ar = gameBoard.slice(y * 7 + x, y * 7 + x + 4);
        winner(ar);
      }
    }

    //check winner column
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 6 - 3; y++) {
        const ar = [
          gameBoard[y * 7 + x],
          gameBoard[(y + 1) * 7 + x],
          gameBoard[(y + 2) * 7 + x],
          gameBoard[(y + 3) * 7 + x]
        ];

        winner(ar)
      }
    }

    //check winner cross-down (\)
    for (let x = 0; x < 7-3; x++) {
      for (let y = 0; y < 6 - 3; y++) {
        const ar = [
          gameBoard[y * 7 + x],
          gameBoard[(y + 1) * 7 + (x + 1)],
          gameBoard[(y + 2) * 7 + (x + 2)],
          gameBoard[(y + 3) * 7 + (x + 3)]
        ];

        winner(ar);
      }
    }
    // check winner cross-up (/)
    for (let x = 0; x < 7-3; x++) {
      for (let y = 0; y < 6-3; y++) {
        const ar = [
          gameBoard[(-y * 7) + x + 35],
          gameBoard[((-y - 1) * 7) + (x + 1) + 35],
          gameBoard[((-y - 2) * 7) + (x + 2) + 35],
          gameBoard[((-y - 3) * 7) + (x + 3) + 35]
        ];

        winner(ar)
      }
    }
  }

  checkWinner()

  function draw(){
    let drawArray = state.cell.includes(null);

    if(!drawArray){
      state.gameOver = true;
      state.winner = 'Mr.Tie';
    }
  }

  function winner(ar) {
    if (ar[0] === 'red' && ar[1] === 'red' && ar[2] === 'red' && ar[3] === 'red') {
      state.gameOver = true;
      state.winner = 'red';
    } if (ar[0] === 'yellow' && ar[1] === 'yellow' && ar[2] === 'yellow' && ar[3] === 'yellow') {
       state.gameOver = true;
       state.winner = 'yellow';
    } else{
      return draw()
    }
  }

  function onClickColum(index) {

    let rowIndex = Math.floor(index / 7);
    let columnIndex = index % 7;
    let placementIndex = rowIndex * 7 + columnIndex;
    let playerTurn = state.player;
    let currentBoard = state.cell;

    if (playerTurn === 'yellow') {
      playerTurn = 'red'
    } else {
      playerTurn = 'yellow'
    }

    dispatch({type: "fill_cell", placementIndex, playerTurn});
  }

  return (<div className="App">
    <h1>Connect Four</h1>
    {state.gameOver ? <h3>The winner is {state.winner} !</h3> : <h3>It's your turn {state.player == 'yellow' ? 'red' : 'yellow'}</h3>}
    {state.gameOver ? <button className='newGame'onClick={() => dispatch({ type: 'newGame'})}>New game</button> : false}
    <BoardCell onClick={onClickColum} cell={state.cell}/>
  </div>);
}

export default App;
