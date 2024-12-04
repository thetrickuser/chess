import { Pool } from 'pg';
import 'dotenv/config'; 

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST_URL,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_CA,
  },
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