import { Square, PieceSymbol, Color, Chess } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../screens/Game";

function generateChessBoard() {
  const boardArray = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  for (let rank of ranks) {
    let rankArray = [];
      for (let file of files) {
          rankArray.push(file + rank);
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
  playerColor
}: {
  chess: Chess;
  socket: WebSocket;
  validMoves: string[],
  playerColor: string
}) => {
    const currentBoard = playerColor === "white" ? chessBoard : chessBoard.map(row => [...row].reverse()).reverse();

    const [from, setFrom] = useState<string>('');

  return (
    <div className="text-red-400">
      {currentBoard.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              className={`${ chess.squareColor(square) === "dark" ? "bg-black" : "bg-white"
              } w-16 h-16 text-2xl border border-black flex justify-center items-center`}
              onClick={() => {
                if (playerColor.startsWith(chess.turn())) {
                  let valid = false;
                  validMoves.forEach((move: string) => {
                    if (move.includes(square)) {
                      valid = true;
                    }
                  })
                  const currentSquare = chess.get(square);
                  if (currentSquare) {
                    if (currentSquare.color === chess.turn()) {
                      setFrom(square);
                      socket.send(JSON.stringify({
                        type: "moving",
                        from: square
                      }))
                    } else {                   
                      if (valid) {
                        socket.send(JSON.stringify({
                          type: MOVE,
                          payload: {
                              from,
                              to: square
                          }
                      }))
                      }
                    }
                  } else {
                    if (valid) {
                      socket.send(JSON.stringify({
                        type: MOVE,
                        payload: {
                            from,
                            to: square
                        }
                    }))
                    } else {
                      setFrom('');
                    }
                  }
                }
              }}
            >
              {chess.get(square) ? chess.get(square).type : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
