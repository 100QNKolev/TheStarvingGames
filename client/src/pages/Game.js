import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';

function Game() {
  const { gameId } = useParams();
  const { socket, joinGame } = useSocket();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchGame();
    if (socket) {
      joinGame(gameId);
      socket.on('gameUpdate', handleGameUpdate);
    }
    return () => {
      if (socket) {
        socket.off('gameUpdate', handleGameUpdate);
      }
    };
  }, [gameId, socket]);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/games/${gameId}`);
      setGame(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch game');
      setLoading(false);
    }
  };

  const handleGameUpdate = (updatedGame) => {
    setGame(updatedGame);
  };

  const generateEvent = async () => {
    try {
      setGenerating(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/games/${gameId}/events`
      );
      setGame(response.data.game);
    } catch (error) {
      setError('Failed to generate event');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-game-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-md">
        {error}
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center text-gray-300">
        Game not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-game text-game-primary mb-2">
            {game.title}
          </h1>
          <div className="text-gray-300">
            Day {game.currentDay} | Status: {game.status}
          </div>
        </div>
        {game.status === 'in-progress' && (
          <button
            onClick={generateEvent}
            disabled={generating}
            className="bg-game-primary hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Event'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-game-surface rounded-lg p-6">
            <h2 className="text-2xl font-game text-game-accent mb-4">Events</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {game.events.slice().reverse().map((event, index) => (
                <div
                  key={index}
                  className="bg-game-background p-4 rounded-md"
                >
                  <div className="text-sm text-gray-400 mb-1">
                    Day {event.day} - {event.type}
                  </div>
                  <div className="text-white">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-game-surface rounded-lg p-6">
            <h2 className="text-2xl font-game text-game-accent mb-4">Players</h2>
            <div className="space-y-3">
              {game.players.map(({ player, status, kills }) => (
                <div
                  key={player._id}
                  className={`bg-game-background p-3 rounded-md ${
                    status === 'deceased' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-gray-400">
                        {status} | Kills: {kills}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        status === 'alive'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {game.status === 'completed' && game.winner && (
            <div className="mt-6 bg-game-accent text-game-secondary rounded-lg p-6">
              <h2 className="text-2xl font-game mb-2">Winner!</h2>
              <div className="font-medium">{game.winner.name}</div>
              <div className="text-sm mt-1">
                Survived {game.currentDay} days
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Game; 