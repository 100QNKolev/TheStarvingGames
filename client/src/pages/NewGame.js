import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

function NewGame() {
  const navigate = useNavigate();
  const [gameSettings, setGameSettings] = useState({
    title: '',
    maxPlayers: 12,
    aiDifficulty: 'medium',
    eventFrequency: 'medium'
  });
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/players`);
      setPlayers(response.data.players);
    } catch (error) {
      setError('Failed to fetch players');
    }
  };

  const handleGenerateAIPlayers = async () => {
    try {
      setLoading(true);
      const count = gameSettings.maxPlayers - selectedPlayers.length;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/players/generate-multiple`,
        { count }
      );
      setSelectedPlayers([...selectedPlayers, ...response.data]);
    } catch (error) {
      setError('Failed to generate AI players');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    try {
      setLoading(true);
      // Create the game
      const gameResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/games`, gameSettings);
      const gameId = gameResponse.data._id;

      // Add players to the game
      for (const player of selectedPlayers) {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/games/${gameId}/players`, {
          player
        });
      }

      // Start the game
      await axios.post(`${process.env.REACT_APP_API_URL}/api/games/${gameId}/start`);

      // Navigate to the game page
      navigate(`/game/${gameId}`);
    } catch (error) {
      setError('Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayer = (playerId) => {
    setSelectedPlayers(selectedPlayers.filter(p => p._id !== playerId));
  };

  const handleAddPlayer = (player) => {
    if (selectedPlayers.length < gameSettings.maxPlayers) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-game text-game-primary mb-8">Create New Game</h1>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-game text-game-accent mb-4">Game Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Game Title
              </label>
              <input
                type="text"
                value={gameSettings.title}
                onChange={(e) => setGameSettings({ ...gameSettings, title: e.target.value })}
                className="w-full bg-game-surface text-white rounded-md border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Maximum Players
              </label>
              <select
                value={gameSettings.maxPlayers}
                onChange={(e) => setGameSettings({ ...gameSettings, maxPlayers: parseInt(e.target.value) })}
                className="w-full bg-game-surface text-white rounded-md border-gray-600"
              >
                {[4, 8, 12, 16, 24].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                AI Difficulty
              </label>
              <select
                value={gameSettings.aiDifficulty}
                onChange={(e) => setGameSettings({ ...gameSettings, aiDifficulty: e.target.value })}
                className="w-full bg-game-surface text-white rounded-md border-gray-600"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Event Frequency
              </label>
              <select
                value={gameSettings.eventFrequency}
                onChange={(e) => setGameSettings({ ...gameSettings, eventFrequency: e.target.value })}
                className="w-full bg-game-surface text-white rounded-md border-gray-600"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-game text-game-accent mb-4">Players</h2>
          <div className="bg-game-surface p-4 rounded-md mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">
                Selected: {selectedPlayers.length} / {gameSettings.maxPlayers}
              </span>
              <button
                onClick={handleGenerateAIPlayers}
                disabled={loading || selectedPlayers.length >= gameSettings.maxPlayers}
                className="bg-game-primary hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                Generate AI Players
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedPlayers.map(player => (
                <div
                  key={player._id}
                  className="flex justify-between items-center bg-game-background p-2 rounded-md"
                >
                  <span>{player.name}</span>
                  <button
                    onClick={() => handleRemovePlayer(player._id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-game-surface p-4 rounded-md">
            <h3 className="font-game text-lg mb-2">Available Players</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {players.map(player => (
                <div
                  key={player._id}
                  className="flex justify-between items-center bg-game-background p-2 rounded-md"
                >
                  <span>{player.name}</span>
                  <button
                    onClick={() => handleAddPlayer(player)}
                    disabled={selectedPlayers.some(p => p._id === player._id)}
                    className="text-green-500 hover:text-green-400 disabled:opacity-50"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleCreateGame}
          disabled={loading || !gameSettings.title || selectedPlayers.length < 2}
          className="bg-game-accent hover:bg-yellow-500 text-game-secondary px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Game'}
        </button>
      </div>
    </div>
  );
}

export default NewGame; 