import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";
import Timer from "../components/Timer";
import { useNavigate } from "react-router-dom";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game over";

export const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  console.log(socket)
  const [chess, setChess] = useState(new Chess());
  const [gameOn, setGameOn] = useState(false);
  const [playerColor, setPlayerColor] = useState("");
  const [validMoves, setValidMoves] = useState([]);
  const [gameId, setGameId] = useState(0);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setPlayerColor(message.payload.color);
          setGameOn(true);
          setGameId(message.payload.gameId);
          break;
        case MOVE:
          const move = message.payload;
          console.log("chess before move");
          console.log(chess);
          chess.move(move);
          setChess(new Chess(chess.fen()));
          console.log("chess after move");
          console.log(chess);
          break;
        case "validMoves":
          setValidMoves(message.payload);
          break;
        case GAME_OVER:
          alert("game over");
          break;
      }
    };
  }, [socket, chess]);

  if (!socket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="h-screen pt-8 grid grid-cols-6">
        <div className="col-span-4 flex justify-center">
          <ChessBoard
            socket={socket}
            chess={chess}
            validMoves={validMoves}
            playerColor={playerColor}
            gameId={gameId}
          />
        </div>
        <div className="col-span-2 bg-slate-800 h-4/5 w-2/3 flex flex-col justify-center gap-4 items-center">
          {gameOn ? (
            <>
            <Timer chess={chess} playerColor={playerColor}/>
            <Button onClick={() => console.log('resign')}>Resign</Button>
            <Button onClick={() => console.log('resign')}>Draw</Button>
            </>
          ) : (
            <>
            <Button
              onClick={() => socket.send(JSON.stringify({ type: INIT_GAME}))}
            >
              Start 10 min
            </Button>
            <Button
              onClick={() => socket.send(JSON.stringify({ type: INIT_GAME}))}
            >
              Join Game
            </Button>
            <Button
              onClick={() => navigate("/createGame")}
            >
              Create Game
            </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
