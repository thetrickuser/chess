import {WebSocket} from "ws";
import {Chess, Square} from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private moves: string[];
    private startTime: Date;
    private moveCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.moveCount = 0;
        this.startTime = new Date();
        this.sendInitMessage();
    }

    sendInitMessage() {
        console.log("sending init message");
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
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

        // check if the game is over

        if (this.board.isGameOver()) {
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
        
        // console.log("move count", this.moveCount)
        // if (this.moveCount % 2 === 1) {
            // console.log("sending move to player 2", move)
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));
        // } else {
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }));            
    }
}