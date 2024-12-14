import express from 'express';

const router = express.Router();

router.use(express.json());

// REST endpoints for user register and login
router.post('/register', (req, res) => {
    // Handle user registration
    
    res.send('User registered');
});

router.post('/login', (req, res) => {
    // Handle user login
    res.send('User logged in');
});

// REST endpoint for creating a game
router.post('/create-game', (req, res) => {
    res.json(res);
});

// REST endpoint for joining a game
router.post('/join-game', (req, res) => {
    const { userId, gameId } = req.body;
    res.json(res);
});

export default router;
