import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-game text-game-primary mb-4">
          Welcome to The Starving Games
        </h1>
        <p className="text-xl text-gray-300">
          An AI-powered parody simulator where anything can happen!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-game-surface rounded-lg p-6">
          <h2 className="text-2xl font-game text-game-accent mb-4">
            Create a New Game
          </h2>
          <p className="text-gray-300 mb-4">
            Start a new simulation with AI-generated characters and watch the chaos unfold!
          </p>
          <Link
            to="/new-game"
            className="inline-flex items-center bg-game-primary hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Start New Game
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>

        <div className="bg-game-surface rounded-lg p-6">
          <h2 className="text-2xl font-game text-game-accent mb-4">
            Manage Players
          </h2>
          <p className="text-gray-300 mb-4">
            Create custom players or generate AI characters to join the games.
          </p>
          <Link
            to="/players"
            className="inline-flex items-center bg-game-secondary hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            View Players
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      <div className="bg-game-surface rounded-lg p-8">
        <h2 className="text-2xl font-game text-game-accent mb-4">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-game-primary text-4xl font-bold mb-2">1</div>
            <h3 className="font-game text-lg mb-2">Create or Select Players</h3>
            <p className="text-gray-300">
              Generate AI-powered characters or create your own custom players to join the games.
            </p>
          </div>
          <div>
            <div className="text-game-primary text-4xl font-bold mb-2">2</div>
            <h3 className="font-game text-lg mb-2">Start a New Game</h3>
            <p className="text-gray-300">
              Configure game settings and select your participants for the ultimate showdown.
            </p>
          </div>
          <div>
            <div className="text-game-primary text-4xl font-bold mb-2">3</div>
            <h3 className="font-game text-lg mb-2">Watch Events Unfold</h3>
            <p className="text-gray-300">
              Experience AI-generated events, alliances, betrayals, and dramatic moments!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;