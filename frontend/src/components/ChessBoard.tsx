import { Chess, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

function generateChessBoard() {
  const boardArray: Square[][] = [];
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  for (let rank of ranks) {
    let rankArray: Square[] = [];
    for (let file of files) {
      rankArray.push((file + rank) as Square);
    }
    boardArray.push(rankArray);
  }

  return boardArray;
}

const chessBoard = generateChessBoard();

export const ChessBoard = ({
  chess,
  socket,
  validMoves,
  playerColor,
  gameId
}: {
  chess: Chess;
  socket: WebSocket;
  validMoves: string[];
  playerColor: string;
  gameId: number
}) => {
  const currentBoard =
    playerColor === "white"
      ? chessBoard
      : chessBoard.map((row) => [...row].reverse()).reverse();

  const [from, setFrom] = useState<string>("");

  const handleClick = (square: Square) => {
    if (playerColor.startsWith(chess.turn())) {
      let valid = getValidSquare(validMoves, square);
      const currentSquare = chess.get(square);
      if (currentSquare) {
        if (currentSquare.color === chess.turn()) {
          setFrom(square);
          getValidMoves(socket, square, gameId);
        } else {
          if (valid) {
            sendCaptureMove(socket, from, square, gameId);
          }
        }
      } else {
        if (valid) {
          makeMove(socket, from, square, gameId);
        } else {
          setFrom("");
        }
      }
    }
  };

  return (
    <div className="text-red-400">
      {currentBoard.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              className={`${
                chess.squareColor(square) === "dark"
                  ? "bg-lime-600"
                  : "bg-lime-50"
              } size-16 text-2xl flex justify-center items-center`}
              onClick={() => handleClick(square)}
            >
              {chess.get(square) ? (
                <img
                  src={`/${
                    chess.get(square).color === "b"
                      ? chess.get(square).type
                      : `${chess.get(square).type} light`
                  }.png`}
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

function makeMove(socket: WebSocket, from: string, square: string, gameId: number) {
  socket.send(
    JSON.stringify({
      type: MOVE,
      payload: {
        gameId,
        from,
        to: square,
      },
    })
  );
}

function sendCaptureMove(socket: WebSocket, from: string, square: string, gameId: number) {
  socket.send(
    JSON.stringify({
      type: MOVE,
      payload: {
        from,
        to: square,
        gameId
      },
    })
  );
}

function getValidMoves(socket: WebSocket, square: string, gameId: number) {
  socket.send(
    JSON.stringify({
      type: "moving",
      from: square,
      gameId
    })
  );
}

function getValidSquare(validMoves: string[], square: string) {
  let valid = false;
  validMoves.forEach((move: string) => {
    if (move.includes(square)) {
      valid = true;
    }
  });
  return valid;
}
