import {WebSocket} from "ws";
import {Chess, Square} from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { saveGameState } from './database';

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    public gameId: number
    private moveCount: number;

    constructor(player1: WebSocket, player2: WebSocket, gameId: number) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.gameId = gameId;
        this.moveCount = 0;
        this.sendInitMessage(gameId);
    }

    sendInitMessage(gameId: number) {
        console.log("sending init message");
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
                gameId,
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
                gameId
            }
        }));
    }

    getValidMoves(startingSquare: Square) {
        const validMoves = this.board.moves({square: startingSquare});
        if (this.moveCount % 2 === 1) {
            this.player2.send(JSON.stringify({
                type: "validMoves",
                payload: validMoves
            }));
        } else {
            this.player1.send(JSON.stringify({
                type: "validMoves",
                payload: validMoves
            }));            
        }
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }) {
        // Validate type of move
        console.log("making move")
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            console.log('wrong player')
            return;
        }
        
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            console.log('wrong player')
            return;
        }

        try {
            this.board.move(move);
            this.moveCount++;
            console.log('move made')
            console.log(this.board.turn())
        } catch (e) {
            return;
        }

        const moveNumber = this.board.moveNumber();
         const isGameOver = this.board.isGameOver();
        // check if the game is over

        if (this.board.isGameOver()) {
            const gameState = {
                gameId: this.gameId,
                state: this.board.fen(),
                moveNumber,
                isGameOver,
              };
              saveGameState(gameState).catch((err) => console.error(err));
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
            
            return;
        }

         // Save game state to database
         
    const gameState = {
        gameId: this.gameId,
        state: this.board.fen(),
        moveNumber,
        isGameOver,
      };
      saveGameState(gameState).catch((err) => console.error(err));
        
        console.log("move count", this.moveCount)
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));            
    }
}