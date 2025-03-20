const Player = require('../models/Player');
const aiService = require('../services/aiService');

class PlayerController {
  async createPlayer(req, res) {
    try {
      const playerData = req.body;
      const player = new Player({
        ...playerData,
        type: 'custom'
      });

      await player.save();
      res.status(201).json(player);
    } catch (error) {
      console.error('Error creating player:', error);
      res.status(500).json({ error: 'Failed to create player' });
    }
  }

  async generateAIPlayer(req, res) {
    try {
      const characterData = await aiService.generateCharacter();
      
      const player = new Player({
        name: characterData.name,
        type: 'ai',
        description: characterData.description,
        attributes: characterData.attributes,
        personality: characterData.personality,
        backstory: characterData.backstory,
        specialAbility: characterData.specialAbility
      });

      await player.save();
      res.status(201).json(player);
    } catch (error) {
      console.error('Error generating AI player:', error);
      res.status(500).json({ error: 'Failed to generate AI player' });
    }
  }

  async generateMultipleAIPlayers(req, res) {
    try {
      const { count = 1 } = req.query;
      const players = [];

      for (let i = 0; i < count; i++) {
        const characterData = await aiService.generateCharacter();
        const player = new Player({
          name: characterData.name,
          type: 'ai',
          description: characterData.description,
          attributes: characterData.attributes,
          personality: characterData.personality,
          backstory: characterData.backstory,
          specialAbility: characterData.specialAbility
        });
        await player.save();
        players.push(player);
      }

      res.status(201).json(players);
    } catch (error) {
      console.error('Error generating multiple AI players:', error);
      res.status(500).json({ error: 'Failed to generate AI players' });
    }
  }

  async getPlayer(req, res) {
    try {
      const { playerId } = req.params;
      const player = await Player.findById(playerId);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.json(player);
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ error: 'Failed to fetch player' });
    }
  }

  async getPlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const player = await Player.findById(playerId);

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      const stats = {
        ...player.statistics,
        winRate: player.getWinRate()
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching player stats:', error);
      res.status(500).json({ error: 'Failed to fetch player stats' });
    }
  }

  async listPlayers(req, res) {
    try {
      const { type, sort = 'name', limit = 10, skip = 0 } = req.query;
      const query = type ? { type } : {};

      const players = await Player.find(query)
        .sort(sort)
        .skip(parseInt(skip))
        .limit(parseInt(limit));

      const total = await Player.countDocuments(query);

      res.json({
        players,
        total,
        hasMore: total > parseInt(skip) + players.length
      });
    } catch (error) {
      console.error('Error listing players:', error);
      res.status(500).json({ error: 'Failed to list players' });
    }
  }

  async updatePlayer(req, res) {
    try {
      const { playerId } = req.params;
      const updateData = req.body;

      const player = await Player.findByIdAndUpdate(
        playerId,
        { $set: updateData },
        { new: true }
      );

      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }

      res.json(player);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ error: 'Failed to update player' });
    }
  }
}

module.exports = new PlayerController(); 