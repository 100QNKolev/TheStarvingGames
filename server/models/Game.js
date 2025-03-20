const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  description: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  type: {
    type: String,
    enum: ['death', 'alliance', 'betrayal', 'combat', 'environment', 'other'],
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  players: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    status: {
      type: String,
      enum: ['alive', 'deceased'],
      default: 'alive'
    },
    causeOfDeath: String,
    dayOfDeath: Number,
    kills: { type: Number, default: 0 },
    alliances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
  }],
  events: [eventSchema],
  currentDay: { type: Number, default: 0 },
  settings: {
    maxPlayers: { type: Number, required: true },
    aiDifficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    eventFrequency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update the updatedAt timestamp
gameSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if game is over
gameSchema.methods.isGameOver = function() {
  const alivePlayers = this.players.filter(p => p.status === 'alive');
  return alivePlayers.length <= 1;
};

// Method to get alive players
gameSchema.methods.getAlivePlayers = function() {
  return this.players.filter(p => p.status === 'alive');
};

// Method to process player death
gameSchema.methods.processPlayerDeath = function(playerId, cause, day) {
  const playerIndex = this.players.findIndex(p => p.player.toString() === playerId.toString());
  if (playerIndex !== -1) {
    this.players[playerIndex].status = 'deceased';
    this.players[playerIndex].causeOfDeath = cause;
    this.players[playerIndex].dayOfDeath = day;
  }
};

const Game = mongoose.model('Game', gameSchema);

module.exports = Game; 