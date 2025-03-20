const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateCharacter() {
    const prompt = `Generate a humorous character for a Hunger Games parody. Include:
    - Name
    - Brief description
    - Unique personality traits
    - Special ability
    - Funny backstory
    Format as JSON. Keep it entertaining but not offensive.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a creative AI generating humorous but tasteful content for a Hunger Games parody game."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 500
      });

      const character = JSON.parse(response.choices[0].message.content);
      return this._normalizeCharacterStats(character);
    } catch (error) {
      console.error('Error generating character:', error);
      throw new Error('Failed to generate character');
    }
  }

  async generateEvent(players, day, gameState) {
    const prompt = `Generate a humorous event for day ${day} of a Hunger Games parody. Players involved: ${players.map(p => p.name).join(', ')}. 
    Current game state: ${JSON.stringify(gameState)}
    Create an entertaining scenario that could involve alliances, betrayals, or combat. Format as JSON with:
    - description
    - type (death/alliance/betrayal/combat/environment/other)
    - affected_players
    - outcomes`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a creative AI generating humorous but tasteful content for a Hunger Games parody game."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.9,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating event:', error);
      throw new Error('Failed to generate event');
    }
  }

  async generateDeathScene(player, cause) {
    const prompt = `Generate a dramatic and humorous death scene for ${player.name} in a Hunger Games parody. 
    Cause: ${cause}
    Include their final moments in an entertaining but not grotesque way.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a creative AI generating humorous but tasteful content for a Hunger Games parody game."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 300
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating death scene:', error);
      throw new Error('Failed to generate death scene');
    }
  }

  _normalizeCharacterStats(character) {
    // Ensure all required stats are present and within bounds
    const normalized = {
      ...character,
      attributes: {
        strength: this._normalizeValue(character.attributes?.strength || Math.random() * 10),
        agility: this._normalizeValue(character.attributes?.agility || Math.random() * 10),
        intelligence: this._normalizeValue(character.attributes?.intelligence || Math.random() * 10),
        charisma: this._normalizeValue(character.attributes?.charisma || Math.random() * 10)
      },
      personality: {
        aggression: this._normalizeValue(character.personality?.aggression || Math.random() * 10),
        loyalty: this._normalizeValue(character.personality?.loyalty || Math.random() * 10),
        strategy: this._normalizeValue(character.personality?.strategy || Math.random() * 10)
      }
    };

    return normalized;
  }

  _normalizeValue(value) {
    // Ensure value is between 1 and 10
    return Math.max(1, Math.min(10, Math.round(value)));
  }
}

module.exports = new AIService(); 