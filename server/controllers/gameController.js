const Game = require('../models/Game');
const Player = require('../models/Player');
const aiService = require('../services/aiService');

class GameController {
  async createGame(req, res) {
    try {
      const { title, maxPlayers, aiDifficulty, eventFrequency } = req.body;
      
      const game = new Game({
        title,
        settings: {
          maxPlayers,
          aiDifficulty,
          eventFrequency
        }
      });

      await game.save();
      res.status(201).json(game);
    } catch (error) {
      console.error('Error creating game:', error);
      res.status(500).json({ error: 'Failed to create game' });
    }
  }

  async addPlayer(req, res) {
    try {
      const { gameId } = req.params;
      const { player } = req.body;

      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (game.players.length >= game.settings.maxPlayers) {
        return res.status(400).json({ error: 'Game is full' });
      }

      game.players.push({
        player: player._id,
        status: 'alive'
      });

      await game.save();
      res.json(game);
    } catch (error) {
      console.error('Error adding player:', error);
      res.status(500).json({ error: 'Failed to add player' });
    }
  }

  async startGame(req, res) {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId).populate('players.player');

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (game.players.length < 2) {
        return res.status(400).json({ error: 'Not enough players' });
      }

      game.status = 'in-progress';
      game.currentDay = 1;

      // Generate initial event
      const initialEvent = await aiService.generateEvent(
        game.players.map(p => p.player),
        game.currentDay,
        { type: 'game-start' }
      );

      game.events.push({
        day: game.currentDay,
        description: initialEvent.description,
        participants: initialEvent.affected_players,
        type: initialEvent.type
      });

      await game.save();
      res.json(game);
    } catch (error) {
      console.error('Error starting game:', error);
      res.status(500).json({ error: 'Failed to start game' });
    }
  }

  async generateEvent(req, res) {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId).populate('players.player');

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (game.status !== 'in-progress') {
        return res.status(400).json({ error: 'Game is not in progress' });
      }

      const alivePlayers = game.getAlivePlayers();
      if (alivePlayers.length <= 1) {
        game.status = 'completed';
        if (alivePlayers.length === 1) {
          game.winner = alivePlayers[0].player;
          // Update winner's statistics
          const winner = await Player.findById(alivePlayers[0].player);
          await winner.updateStats({
            won: true,
            kills: alivePlayers[0].kills,
            survivalDays: game.currentDay
          });
        }
        await game.save();
        return res.json({ message: 'Game Over', game });
      }

      // Generate new event
      const event = await aiService.generateEvent(
        alivePlayers.map(p => p.player),
        game.currentDay,
        { type: 'day-event', aliveCount: alivePlayers.length }
      );

      // Process event outcomes
      if (event.type === 'death') {
        for (const playerId of event.affected_players) {
          const deathScene = await aiService.generateDeathScene(
            alivePlayers.find(p => p.player._id.toString() === playerId).player,
            event.cause
          );
          game.processPlayerDeath(playerId, deathScene, game.currentDay);
        }
      }

      game.events.push({
        day: game.currentDay,
        description: event.description,
        participants: event.affected_players,
        type: event.type
      });

      game.currentDay += 1;
      await game.save();

      res.json({ event, game });
    } catch (error) {
      console.error('Error generating event:', error);
      res.status(500).json({ error: 'Failed to generate event' });
    }
  }

  async getGame(req, res) {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId)
        .populate('players.player')
        .populate('winner');

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      res.json(game);
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ error: 'Failed to fetch game' });
    }
  }
}

module.exports = new GameController(); 