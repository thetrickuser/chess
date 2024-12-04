import { Pool } from 'pg';

const config = {
  user: "avnadmin",
  password: "AVNS_6exL7yjEHvAxlf_DYSM",
  host: "chess-postgres-chess-game.e.aivencloud.com",
  port: 13997,
  database: "defaultdb",
  ssl: {
      rejectUnauthorized: true,
      ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUE76+BCGENCg6zLrw7S3p1ILaZSIwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvYTBkZTYzOTItOTMzYS00ODdlLThmZDYtODZiNDMzNTZh
OGUxIFByb2plY3QgQ0EwHhcNMjQxMjA0MDQwOTI2WhcNMzQxMjAyMDQwOTI2WjA6
MTgwNgYDVQQDDC9hMGRlNjM5Mi05MzNhLTQ4N2UtOGZkNi04NmI0MzM1NmE4ZTEg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANfGOyy4
I7xTyTTRbUVxGevDSjh/Stsldum8tvS0vK7E/gVLVFjxYhXdZrcvS0SG1xgxwckD
efvBj2Cx5HZjiC6Wnig3QLAsPz1be3a+8/qZAptf5sSqBr4xkU3IkufO1Pg/kQYx
emhiSzdc59U90FhEzRQDW0rSD0KjxllPdBY0g7vwUiK7rENUh+zGWQmzbtXGYxVp
8oHaJhAjQ2yiM9BicAL1W3E64BEr6/wWTW4a1KRnO8kzjRK6ibh8So544E7l4M8v
2xjzhawCLXutmkzaSvuSgMsVjc6ulP+wYv7IoCEVDWdp/h6HioeEUTGKmBKf3tGW
xn84cxkaRF6LGDltFe3lj8sL6PVWOg9yazYmXxRQbdv7lV4XIqnE3VVos/c6YehM
IFNICRa17hv680KNeeNs1FQsp0u3Dinim8xvxep5jKfwzV8z5+reOQrAKzi6B9Bx
WCly6zCJhDFc3WqHRVgfWF+rfLLEaOYsuYgw/4Uwpl/4JKLuXug+aBNv9QIDAQAB
oz8wPTAdBgNVHQ4EFgQUD0b92n3JEjKzZ9av6mSJXPI8YxowDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAI/mNwNEeBuS6It+
OUc1hMXYxKUJkqa32hIVo8tC1w2KGjciod/VGbDYs6j7+UzsEp1+PtyUqfOP5KNm
uvLHjcuiP5GcDCBYwskl1kbTw7tITF8USM/d5sC6wC2iXYJsDT2DuiYsUh4+Dbor
u/V/Ya/v72797VM8AjULG/1kXm7Jd/gNjyD7LzDlfU5i90BBI9TbiKAwoimeGebn
V2UbBksV+9YlJgivPI28u+IQ8NWrxrJQDO4dD/8g6swL9MaIFQdOzeYh5GCuJN8B
rRY0trYhAiJwJQwwH4sXJ7VDKbFzV5Qo22tMo9Iqf4rtdLOSMAJiOoC7dWJ/mVea
t7vJ8EMMDANLkUleD1ykTdaIj2n2hBiAuIhH/9CLxRXB42FEFUIfk+4cj0/JfDzM
PKkmYL9vFhk1pe9IppUPFi/+jnpWKQQlnMUBTTjTjEeJj1PSWfXSGiSLggW2dbpa
6Gz7nrfbWWuLMnbr9o57oukjY9c/SJc31sH2AuHrvMCIwPnz7w==
-----END CERTIFICATE-----`,
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