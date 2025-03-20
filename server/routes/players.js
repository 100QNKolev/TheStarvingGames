const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Create a custom player
router.post('/', playerController.createPlayer);

// Generate an AI player
router.post('/generate', playerController.generateAIPlayer);

// Generate multiple AI players
router.post('/generate-multiple', playerController.generateMultipleAIPlayers);

// Get player details
router.get('/:playerId', playerController.getPlayer);

// Get player statistics
router.get('/:playerId/stats', playerController.getPlayerStats);

// List players with filtering and pagination
router.get('/', playerController.listPlayers);

// Update player
router.put('/:playerId', playerController.updatePlayer);

module.exports = router; 