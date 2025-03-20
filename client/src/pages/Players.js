import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/solid';

function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    description: '',
    attributes: {
      strength: 5,
      agility: 5,
      intelligence: 5,
      charisma: 5
    },
    personality: {
      aggression: 5,
      loyalty: 5,
      strategy: 5
    }
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/players`);
      setPlayers(response.data.players);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch players');
      setLoading(false);
    }
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/players`,
        newPlayer
      );
      setPlayers([...players, response.data]);
      setShowCreateForm(false);
      setNewPlayer({
        name: '',
        description: '',
        attributes: {
          strength: 5,
          agility: 5,
          intelligence: 5,
          charisma: 5
        },
        personality: {
          aggression: 5,
          loyalty: 5,
          strategy: 5
        }
      });
    } catch (error) {
      setError('Failed to create player');
    }
  };

  const handleGenerateAIPlayer = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/players/generate`
      );
      setPlayers([...players, response.data]);
    } catch (error) {
      setError('Failed to generate AI player');
    }
  };

  const StatBar = ({ value, label }) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-2 bg-game-background rounded">
        <div
          className="h-full bg-game-primary rounded"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-game-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-game text-game-primary">Players</h1>
        <div className="space-x-4">
          <button
            onClick={handleGenerateAIPlayer}
            className="bg-game-accent hover:bg-yellow-500 text-game-secondary px-4 py-2 rounded-md font-medium transition-colors"
          >
            Generate AI Player
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-game-primary hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            <PlusIcon className="w-5 h-5 inline-block mr-2" />
            Create Player
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-game-surface rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-game text-game-accent mb-4">Create New Player</h2>
          <form onSubmit={handleCreatePlayer}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    className="w-full bg-game-background text-white rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newPlayer.description}
                    onChange={(e) => setNewPlayer({ ...newPlayer, description: e.target.value })}
                    className="w-full bg-game-background text-white rounded-md h-32"
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="font-game text-lg mb-3">Attributes</h3>
                {Object.entries(newPlayer.attributes).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          attributes: {
                            ...newPlayer.attributes,
                            [key]: parseInt(e.target.value)
                          }
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-right text-sm text-gray-400">{value}/10</div>
                  </div>
                ))}

                <h3 className="font-game text-lg mb-3 mt-6">Personality</h3>
                {Object.entries(newPlayer.personality).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) =>
                        setNewPlayer({
                          ...newPlayer,
                          personality: {
                            ...newPlayer.personality,
                            [key]: parseInt(e.target.value)
                          }
                        })
                      }
                      className="w-full"
                    />
                    <div className="text-right text-sm text-gray-400">{value}/10</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="mr-4 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-game-accent hover:bg-yellow-500 text-game-secondary px-6 py-2 rounded-md font-medium transition-colors"
              >
                Create Player
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map(player => (
          <div key={player._id} className="bg-game-surface rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-game text-game-accent">{player.name}</h3>
                <div className="text-sm text-gray-400">{player.type}</div>
              </div>
              <ChartBarIcon className="w-6 h-6 text-game-primary" />
            </div>

            <p className="text-gray-300 mb-4">{player.description}</p>

            <div className="mb-4">
              <h4 className="font-game text-sm mb-2">Attributes</h4>
              {Object.entries(player.attributes).map(([key, value]) => (
                <StatBar key={key} label={key} value={value} />
              ))}
            </div>

            <div>
              <h4 className="font-game text-sm mb-2">Personality</h4>
              {Object.entries(player.personality).map(([key, value]) => (
                <StatBar key={key} label={key} value={value} />
              ))}
            </div>

            {player.statistics && (
              <div className="mt-4 pt-4 border-t border-game-background">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-game-primary text-xl font-bold">
                      {player.statistics.wins}
                    </div>
                    <div className="text-sm text-gray-400">Wins</div>
                  </div>
                  <div>
                    <div className="text-game-primary text-xl font-bold">
                      {player.statistics.kills}
                    </div>
                    <div className="text-sm text-gray-400">Kills</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Players; 