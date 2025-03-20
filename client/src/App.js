import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NewGame from './pages/NewGame';
import Game from './pages/Game';
import Players from './pages/Players';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <Router>
      <SocketProvider>
        <div className="min-h-screen bg-game-background text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-game" element={<NewGame />} />
              <Route path="/game/:gameId" element={<Game />} />
              <Route path="/players" element={<Players />} />
            </Routes>
          </main>
        </div>
      </SocketProvider>
    </Router>
  );
}

export default App; 