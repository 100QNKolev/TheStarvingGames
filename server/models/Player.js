const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['ai', 'custom'],
    required: true
  },
  description: { type: String, required: true },
  attributes: {
    strength: { type: Number, min: 1, max: 10, required: true },
    agility: { type: Number, min: 1, max: 10, required: true },
    intelligence: { type: Number, min: 1, max: 10, required: true },
    charisma: { type: Number, min: 1, max: 10, required: true }
  },
  personality: {
    aggression: { type: Number, min: 1, max: 10, required: true },
    loyalty: { type: Number, min: 1, max: 10, required: true },
    strategy: { type: Number, min: 1, max: 10, required: true }
  },
  backstory: { type: String },
  avatar: { type: String }, // URL to avatar image
  specialAbility: {
    name: String,
    description: String,
    cooldown: Number
  },
  statistics: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    kills: { type: Number, default: 0 },
    avgSurvivalDays: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now }
});

// Method to calculate win rate
playerSchema.methods.getWinRate = function() {
  if (this.statistics.gamesPlayed === 0) return 0;
  return (this.statistics.wins / this.statistics.gamesPlayed) * 100;
};

// Method to update player statistics after a game
playerSchema.methods.updateStats = function(gameData) {
  const { won, kills, survivalDays } = gameData;
  
  this.statistics.gamesPlayed += 1;
  if (won) this.statistics.wins += 1;
  this.statistics.kills += kills;
  
  // Update average survival days
  const totalDays = (this.statistics.avgSurvivalDays * (this.statistics.gamesPlayed - 1)) + survivalDays;
  this.statistics.avgSurvivalDays = totalDays / this.statistics.gamesPlayed;
};

// Static method to generate AI player
playerSchema.statics.generateAIPlayer = async function(aiService) {
  // This will be implemented when we create the AI service
  // It will use OpenAI to generate player details
  throw new Error('Not implemented');
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player; 