# The Starving Games - AI-Enhanced Hunger Games Simulator

An immersive, AI-powered Hunger Games simulator that generates dynamic, humorous scenarios featuring real-world personas and unpredictable gameplay.

## Features

- 🎮 AI-driven character generation with real-world personas
- 🎭 Dynamic, humorous scenario generation
- 🌍 Customizable game settings
- 📱 Modern, responsive UI
- 🤝 Alliance and betrayal system
- 📊 Game progression tracking
- 💾 Save and share game results

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI API
- **Database**: MongoDB
- **Real-time Updates**: Socket.io

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)
- OpenAI API key

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/the-starving-games.git
   cd the-starving-games
   ```

2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Create a .env file in the root directory:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
the-starving-games/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Utility functions
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
└── shared/              # Shared types and utilities
```

## API Documentation

### Game Endpoints

- `POST /api/games/create` - Create a new game
- `GET /api/games/:id` - Get game details
- `POST /api/games/:id/event` - Generate new game event
- `GET /api/games/:id/players` - Get game players

### Player Endpoints

- `POST /api/players/generate` - Generate AI players
- `POST /api/players/custom` - Add custom player

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the AI capabilities
- The Hunger Games franchise for inspiration 