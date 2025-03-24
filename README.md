# Brick Breaker Game

A classic brick breaker game built with vanilla JavaScript and Vite.

![Brick Breaker Game](/screenshot.png)

## Features

- Classic brick breaker gameplay with paddle, ball, and bricks
- Multiple levels with increasing difficulty
- Power-ups system (big ball, multi-ball)
- High score tracking
- Responsive design for both desktop and mobile

## Technologies Used

- JavaScript (ES6+)
- HTML5 Canvas
- Vite for build and development

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/brick-breaker.git
   cd brick-breaker
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```
npm run build
```

The built files will be in the `dist` directory.

## Docker Support

This project includes Docker support for easy deployment.

### Building the Docker Image

```
docker build -t brick-breaker .
```

### Running the Docker Container

```
docker run -p 8080:80 brick-breaker
```

Then open your browser to `http://localhost:8080`

## Project Structure

```
/
├── src/               # Source files
│   ├── game/          # Game logic
│   │   ├── ball.js    # Ball class
│   │   ├── brick.js   # Brick class
│   │   ├── constants.js # Game constants
│   │   ├── game.js    # Main game class
│   │   ├── paddle.js  # Paddle class
│   │   └── powerups.js # Power-ups
│   ├── main.js        # Entry point
│   └── style.css      # Game styles
├── public/            # Static assets
├── index.html         # HTML template
├── package.json       # Project dependencies
├── Dockerfile         # Docker configuration
└── README.md          # This file
```

## License

MIT

## Acknowledgements

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [MDN Web Docs](https://developer.mozilla.org/) - For Canvas and JavaScript references 