import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game over";



export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [playerColor, setPlayerColor] = useState('');
    const [validMoves, setValidMoves] = useState([]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setPlayerColor(message.payload.color)
                    break;
                case MOVE:
                    const move = message.payload;
                    console.log('chess before move')
                    console.log(chess)
                    chess.move(move);
                    setChess(new Chess(chess.fen()));
                    console.log('chess after move')
                    console.log(chess);
                    break;
                case "validMoves":
                    setValidMoves(message.payload);               
                    break;
                case GAME_OVER:
                    break;
            }
        }

        
    }, [socket, chess]);

    if (!socket) {
        return <div>Loading...</div>
    }

    return (
        <div className="">
            <div className="h-screen pt-8 grid grid-cols-6">
                <div className="col-span-5 flex justify-center">
                    <ChessBoard socket={socket} chess={chess} validMoves={validMoves} playerColor={playerColor}/>
                </div>
                <div className="col-span-1 bg-slate-800 h-4/5 w-2/3 flex justify-center pt-8">
                <Button onClick={() => socket.send(JSON.stringify({type: INIT_GAME}))}>
                  Play
                </Button>
                </div>
            </div>
        </div>
    )
}