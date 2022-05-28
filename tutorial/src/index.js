import React from "react";
import ReactDOM from "react-dom/client";
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { Fireworks } from "fireworks/lib/react";
import "./index.css";

function Square(props) {
  return (
    <button
      style={{ color: props.value === "X" ? props.colors.X : props.colors.O }}
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
        colors={this.props.colors}
      />
    );
  }

  render() {
    let fireworkProps = {
      count: 5,
      interval: 500,
      colors: ["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FCFCFC"],
      calc: (props, i) => ({
        ...props,
        x: 100 + i * (window.innerWidth / 5) - (i + 3),
        y: 250 + Math.random() * 400 - 50 + (i === 2 ? -10 : 0),
      }),
    };
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Gewinner: " + winner;
    } else {
      status = "Nächster Spieler: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div>
        <div className="status">{status}</div>
        <div className="innerBoard">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        <div className="resetButtonRow">
          <button
            className="resetButton"
            onClick={() =>
              this.setState({ squares: Array(9).fill(null), xIsNext: true })
            }
          >
            Neu Starten
          </button>
        </div>
        {winner && <Fireworks {...fireworkProps} />}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themes: [
        {
          board: "#FFAFCC",
          square: "#FFC8DD",
          button: "#BDE0FE",
          X: "#CDB4DB",
          O: "#A2D2FF",
        },
        {
          board: "#A8DADC",
          square: "#457B9D",
          button: "#F1FAEE",
          X: "#1D3557",
          O: "#E63946",
        },
        {
          board: "#2A9D8F",
          square: "#E9C46A",
          button: "#F4A261",
          X: "#264653",
          O: "#E76F51",
        },
      ],
      selectedTheme: 0,
    };
  }
  componentDidMount() {
    this.updateColors(this.state.themes[this.state.selectedTheme]);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateColors(this.state.themes[this.state.selectedTheme]);
  }
  updateColors(colors) {
    document.documentElement.style.setProperty(
      "--gameBoardBackgroundColor",
      colors.board
    );
    document.documentElement.style.setProperty(
      "--gameBoardColor",
      colors.square
    );
    document.documentElement.style.setProperty("--buttonColor", colors.button);
  }

  updateTheme(i) {
    this.setState({ selectedTheme: i });
  }

  render() {
    console.log("render");
    return (
      <div className="game">
        <div className="game-board">
          <Board colors={this.state.themes[this.state.selectedTheme]} />
          <div className="themeSelector">
            <FormControl className="formControl">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="theme1"
                name="radio-buttons-group"
                row
                onChange={(e) => this.updateTheme(e.target.value)}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Mädchen"
                />
                <FormControlLabel value="1" control={<Radio />} label="Junge" />
                <FormControlLabel
                  value="2"
                  control={<Radio />}
                  label="Divers"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
