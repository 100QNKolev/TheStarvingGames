const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Create a new game
router.post('/', gameController.createGame);

// Add a player to a game
router.post('/:gameId/players', gameController.addPlayer);

// Start a game
router.post('/:gameId/start', gameController.startGame);

// Generate a new event
router.post('/:gameId/events', gameController.generateEvent);

// Get game details
router.get('/:gameId', gameController.getGame);

module.exports = router; 