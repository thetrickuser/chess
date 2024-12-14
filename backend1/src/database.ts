import { Pool } from 'pg';
import 'dotenv/config'; 

const config = {
  user: process.env.DB_USER || 'rayzr',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST_URL || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'chess',
  // ssl: {
  //     rejectUnauthorized: true,
  //     ca: process.env.DB_CA,
  // },
};

const pool = new Pool(config);

// Connect to the database when the server starts
pool.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to database:', err);
      process.exit(1);
    }
    console.log('Connected to database');
    // You can also perform some initial setup or queries here
});

export async function saveGameState(gameState: any) {
  const isPresent = await pool.query({text: 'SELECT * FROM game_states WHERE game_id = $1', values: [gameState.gameId]});
  if (isPresent.rows.length > 0) {
    const query = {
      text: 'UPDATE game_states SET state = $1, moveNumber = $2, isGameOver = $3 WHERE game_id = $4',
      values: [gameState.state, gameState.moveNumber, gameState.isGameOver, gameState.gameId],
    };
    await pool.query(query);
  } else {
    const query = {
      text: 'INSERT INTO game_states (game_id, state, moveNumber, isGameOver) VALUES ($1, $2, $3, $4)',
      values: [gameState.gameId, gameState.state, gameState.moveNumber, gameState.isGameOver],
    };
    await pool.query(query);
  }
}

export async function getGameState(gameId: string) {
  const query = {
    text: 'SELECT state FROM game_states WHERE game_id = $1',
    values: [gameId],
  };
  const result = await pool.query(query);
  return result.rows[0].state;
}

export async function registerUser(request:{name: string, password: string, email: string}) {
  const query = {
    text: 'INSERT INTO users (name, password, email) VALUES ($1, $2, $3)',
    values: [request.name, request.password, request.email],
  };
  const result = await pool.query(query);
  
  if (result) {
    return true;
  } else {
    return false;
  }
}

export async function login(request:{email: string, password: string}) {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1 AND password = $2',
    values: [request.email, request.password],
  };


  const result = await pool.query(query);
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return false;
  }
  
}

export async function createGame(request:{userId: number, gameId: number, userColor: string}) {
  const userId = request.userId;
  const query = {
    text: 'INSERT INTO game_states (player1, game_id, moveNumber, isGameOver, player1Color) VALUES ($1, $2, $3, $4, $5)',
    values: [request.userId, request.gameId, 0, 'false', request.userColor],
  };
  await pool.query(query);
}

export async function joinGame(request:{userId: number, gameId: number}) {
  const query = {
    text: 'SELECT * FROM game_states WHERE game_id = $1 AND player2 IS NULL',
  }  
  const result = await pool.query(query);
  if (result.rows.length > 0) {
    const player2Color = result.rows[0].player1Color === 'white' ? 'black' : 'white';
    const query = {
      text: 'UPDATE game_states SET player2 = $1, player2Color = $2 WHERE game_id = $3',
      values: [request.userId, player2Color, request.gameId],
    };
    await pool.query(query);
  }
}

