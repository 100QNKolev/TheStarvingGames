import React from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

function Navbar() {
  const { connected } = useSocket();

  return (
    <nav className="bg-game-secondary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="font-game text-game-primary text-xl">
                The Starving Games
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/new-game"
              className="bg-game-primary hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              New Game
            </Link>
            <Link
              to="/players"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium"
            >
              Players
            </Link>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm text-gray-300">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 