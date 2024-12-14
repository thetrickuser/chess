import {WebSocket} from "ws";
import {INIT_GAME, MOVE} from "./messages";
import {Game} from "./Game";
import { saveGameState } from "./database";

export class GameManager {
    private games: Game[];
    private randomUser: WebSocket | null;
    private customGames: {customUser: WebSocket, gameId: number}[];
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.randomUser = null;
        this.users = [];
        this.customGames = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
        // stop the game here because user left
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            
            if (message.type === INIT_GAME) {
                if (this.randomUser) {
                    // start a game
                    const gameId = Math.round(Math.random() * 1000000);
                    const game = new Game(this.randomUser, socket, gameId);
                    this.games.push(game);
                    this.randomUser = null;
                    saveGameState({gameId, state: '', moveNumber: 0, isGameOver: 'false'})
                } else {
                    // set this user as pending user
                    this.randomUser = socket;
                }
            }

            if (message.type === "create_game") {
                const gameId = Math.round(Math.random() * 1000000);
                this.customGames.push({customUser: socket, gameId});
            }

            if (message.type === "join_game") {
                const gameId = message.payload.gameId;
                const customGame = this.customGames.find(game => game.gameId === gameId);
                if (customGame) {
                    const game = new Game(customGame.customUser, socket, gameId);
                    this.games.push(game);
                    saveGameState({gameId, state: '', moveNumber: 0, isGameOver: 'false'})
                }
            }

            if (message.type === MOVE) {
                console.log("received move", message)
                const game = this.games.find(game =>
                    game.gameId === message.payload.gameId);

                if (game) {
                    game.makeMove(socket, message.payload)
                }
            }

            if (message.type === "moving") {
                const game = this.games.find(game =>
                    game.gameId === message.gameId);

                if (game) {
                    game.getValidMoves(message.from);
                }
            }
        })
    }
}