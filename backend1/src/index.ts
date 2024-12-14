import { WebSocketServer } from 'ws';
import express from 'express';
import {GameManager} from "./GameManager";
import router from './routes';

const app = express();
app.use('/api', router);
app.listen(3000, () => console.log('Example app listening on port 3000!'));

const wss = new WebSocketServer({ port: 8080 });
const gameManager = new GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on('disconnect', () => gameManager.removeUser(ws))
});