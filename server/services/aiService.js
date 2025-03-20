const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      baseURL: "https://models.inference.ai.azure.com",
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateCharacter() {
    const prompt = `Generate a humorous character for a Hunger Games parody. Return only a JSON object with these fields:
    {
      "name": "character name",
      "description": "brief description",
      "unique_personality_traits": ["trait1", "trait2", "trait3"],
      "special_ability": "special ability description",
      "funny_backstory": "humorous backstory"
    }
    Keep it entertaining but not offensive.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "system",
          content: "You are a creative AI generating humorous but tasteful content for a Hunger Games parody game. Always respond with valid JSON only, no markdown or code blocks."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.8,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      // Clean the response by removing any markdown code block syntax
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const character = JSON.parse(cleanedContent);
        return this._normalizeCharacterStats(character);
      } catch (parseError) {
        console.error('Error parsing character JSON:', parseError);
        console.error('Cleaned content was:', cleanedContent);
        throw new Error('Failed to parse character data');
      }
    } catch (error) {
      console.error('Error generating character:', error);
      throw new Error('Failed to generate character');
    }
  }

  async generateEvent(players, day, gameState) {
    // Create a mapping of names to IDs for later use
    const playerMap = players.reduce((map, player) => {
      map[player.name] = player._id.toString();
      return map;
    }, {});

    const prompt = `Generate a humorous event for day ${day} of a Hunger Games parody. Players involved: ${players.map(p => p.name).join(', ')}. 
    Current game state: ${JSON.stringify(gameState)}
    Return only a JSON object with these fields:
    {
      "description": "event description",
      "type": "one of: death/alliance/betrayal/combat/environment/other",
      "affected_player_names": ["player1_name", "player2_name"],
      "outcomes": {
        "player1_name": "outcome description",
        "player2_name": "outcome description"
      }
    }
    Create an entertaining scenario that could involve alliances, betrayals, or combat.
    Use ONLY the following player names: ${players.map(p => p.name).join(', ')}`;

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "system",
          content: "You are a creative AI generating humorous but tasteful content for a Hunger Games parody game. Always respond with valid JSON only, no markdown or code blocks."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.9,
        max_tokens: 500
      });

      const content = response.choices[0].message.content;
      // Clean the response by removing any markdown code block syntax
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        const eventData = JSON.parse(cleanedContent);
        
        // Convert player names to IDs
        const convertedEvent = {
          description: eventData.description,
          type: eventData.type,
          affected_players: eventData.affected_player_names.map(name => playerMap[name]).filter(id => id),
          outcomes: {}
        };

        // Convert outcomes to use player IDs as keys
        Object.entries(eventData.outcomes).forEach(([playerName, outcome]) => {
          const playerId = playerMap[playerName];
          if (playerId) {
            convertedEvent.outcomes[playerId] = outcome;
          }
        });

        return convertedEvent;
      } catch (parseError) {
        console.error('Error parsing event JSON:', parseError);
        console.error('Cleaned content was:', cleanedContent);
        throw new Error('Failed to parse event data');
      }
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
        model: "gpt-4o",
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