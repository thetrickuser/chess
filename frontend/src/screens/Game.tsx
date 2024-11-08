import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess, Color, PieceSymbol, Square } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game over";



export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);

            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess?.board());
                    console.log("Game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess?.move(move);
                    setBoard(chess?.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game over");
                    break;
            }
        }
    }, [socket]);

    if (!socket) {
        return <div>Loading...</div>
    }

    return (
        <div className="">
            <div className="h-screen pt-8 grid grid-cols-6">
                <div className="col-span-4 flex justify-center">
                    <ChessBoard socket={socket} board={board}/>
                </div>
                <div className="col-span-2 bg-slate-800 h-4/5 w-2/3 flex justify-center pt-8">
                <Button onClick={() => socket.send(JSON.stringify({type: INIT_GAME}))}>
                  Play
                </Button>
                </div>
            </div>
        </div>
    )
}