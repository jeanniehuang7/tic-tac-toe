import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button
        className={this.props.winner ? "square winner" : "square"
        } onClick={this.props.onClick} >
        {this.props.value}
      </button>
    )
  }

}


class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      winner={this.props.winnerSquares.includes(i)}
    />;
  }

  render() {

    let boardComponents = [];
    for (let i = 0; i < 3; i++) {
      let boardRow = [];
      for (let j = 0; j < 3; j++) {
        boardRow.push(<span key={3 * i + j}>{this.renderSquare(3 * i + j)}</span>)
      }
      boardComponents.push(<div key={i} className="board-row">{boardRow}</div>)
    }

    return (
      <div>
        {boardComponents}
      </div>
    );
  }
}


class HistoryButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    }
    this.handleHover = this.handleHover.bind(this);
  }

  handleHover() {
    this.setState((previousState) => ({
      hover: !previousState.hover,
    }));
  }
  render() {
    return (<button
      className={this.state.hover ? 'bold' : ''}
      onMouseEnter={this.handleHover}
      onMouseLeave={this.handleHover}
      onClick={() => { this.props.jumpTo(this.props.move) }}>
      {this.props.desc}
    </button>
    )

  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      inOrder: true,
      winnerSquares: []
    }
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];


    // Check if winner 
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // debugger;
        console.log("hello");

        // this.setState({
        //   winnerSquares: [...this.state.winnerSquares, a, b, c]
        // })

        return {
          winnerStr: squares[a],
          location: [a, b, c]
        }
      }

    }

    // Check if all slots are full (and no winner)
    let allFilled = true;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        allFilled = false;
      }
    }
    if (allFilled) {
      return {
        winnerStr: "Draw",
      }
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // const squares = this.state.squares.slice();
    // ignore click if there is winner or already present move
    const winnerInfo = this.calculateWinner(squares);
    if (winnerInfo || squares[i]) {
      if (winnerInfo.location) {
        // this.setState({
        //   winnerSquares: [...this.state.winnerSquares,
        //   winnerInfo.location[0], winnerInfo.location[1], winnerInfo.location[2],]
        // })
      }

      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        row: parseInt((i) / 3),
        col: (i) % 3,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });

  }

  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleToggle() {
    this.setState((previousState) => ({
      inOrder: !previousState.inOrder,
    }));
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerInfo = this.calculateWinner(current.squares);
    const winner = winnerInfo ? winnerInfo.winnerStr : null;

    // mapping history stuff into a list of React elements
    // mapping syntax is:
    // map((element, index) => { ... } )
    // where step is the actual square 
    // and move is the index # in the list in history

    const moves = history.map((step, move) => {
      // console.log("This is move " + move);
      // console.log("printing step");
      // console.log(step);
      // If move is valid - not 0 or null, then can go to move #

      // for (let element in step) {
      let r = step.row;
      let c = step.col;

      const desc = move ?
        'Go to move #' + move + ' at row ' + r + ' at col ' + c :
        'Go to game start';


      return (
        <li key={move}>
          <HistoryButton
            move={move}
            desc={desc}
            jumpTo={this.jumpTo.bind(this)}
          />

        </li>
      )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerSquares={winnerInfo ? winnerInfo.location : []} 
          />
        </div>
        <div className="game-info">

          <div className="status">{status}</div>

          <button className="toggle" onClick={this.handleToggle.bind(this)}>
            Toggle Order
          </button>
          <ol>{this.state.inOrder ? moves : moves.reverse()}</ol>

        </div>
      </div >
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
