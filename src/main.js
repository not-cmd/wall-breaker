import { Game } from './game/game.js';
import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="game-container">
    <canvas id="gameCanvas" width="800" height="600"></canvas>
  </div>
`;

const canvas = document.getElementById('gameCanvas');
const game = new Game(canvas);

function gameLoop() {
  game.update();
  game.draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();