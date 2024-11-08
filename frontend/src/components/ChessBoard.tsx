import { Square, PieceSymbol, Color } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({
  board,
  socket,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
    const [from, setFrom] = useState<Square | null>(null);
    const [to, setTo] = useState<Square | null>(null);

  return (
    <div className="text-red-400">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => (
            <div
              key={j}
              className={`${
                (i + j) % 2 == 0 ? "bg-black" : "bg-white"
              } w-16 h-16 text-2xl border border-black flex justify-center items-center`}
              onClick={() => {
                  if (!from) {
                      setFrom(square?.square ?? null);
                  } else {
                      setTo(square?.square ?? null);
                      socket.send(JSON.stringify({
                          type: MOVE,
                          payload: {
                              from,
                              to
                          }
                      }))
                      console.log(from, to);
                  }
              }}
            >
              {square ? square.type : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
