import { useState } from 'react'

//棋盘格
// eslint-disable-next-line react/prop-types
function Square({ value, onSquareClick }) {
  return (
    <>
      <button className='square' onClick={onSquareClick}>
        {value}
      </button>
    </>
  )
}

// 棋盘
// eslint-disable-next-line react/prop-types
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //判断当前是否胜利
    if (caculateWinner(squares) || squares[i]) {
      return
    }
    // .slice浅拷贝
    // eslint-disable-next-line react/prop-types
    const nextSquares = squares.slice()
    //判断下一步是否是X
    if (xIsNext) {
      //下一步为X
      nextSquares[i] = 'X'
    } else {
      //下一步为O
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }
  const winner = caculateWinner(squares)
  let status
  if (winner) {
    status = 'Winner' + winner
  } else {
    status = 'Next player:' + (xIsNext ? 'X' : 'O')
  }

  return (
    <>
      <div className='status'>{status}</div>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}></Square>
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}></Square>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}></Square>
      </div>
      <div className='board-row'>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}></Square>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}></Square>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}></Square>
      </div>
      <div className='board-row'>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}></Square>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}></Square>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}></Square>
      </div>
    </>
  )
}

function caculateWinner(sequares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (sequares[a] && sequares[a] === sequares[b] && sequares[a] === sequares[c]) {
      return sequares[a]
    }
  }
  return null
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  //history中每个元素都是一个squares数组
  const currentSquares = history[currentMove]

  //onplay
  function handlePlay(nextSquares) {
    //复制history 0--currentMove+1位置的数组，并在数组末尾加上nextSquares
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }
  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to game start'
    }
    return (
      <>
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      </>
    )
  })
  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}></Board>
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}
