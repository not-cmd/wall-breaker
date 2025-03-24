import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Brick } from './brick.js';
import { PowerUp } from './powerups.js';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_PADDING,
  INITIAL_LIVES,
  BRICK_POINTS
} from './constants.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.score = 0;
    this.lives = INITIAL_LIVES;
    this.level = 1;
    this.gameOver = false;
    this.bricksDestroyed = 0;
    
    this.paddle = new Paddle();
    this.balls = [new Ball(CANVAS_WIDTH / 2, this.paddle.y - 10, 4 + this.level * 0.5)];
    this.bricks = this.createBricks();
    this.powerUps = [];
    
    this.setupEventListeners();
    this.loadHighScore();
  }

  createBricks() {
    const bricks = [];
    const rows = 5;
    const cols = Math.floor((CANVAS_WIDTH - BRICK_PADDING) / (BRICK_WIDTH + BRICK_PADDING));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING;
        const y = row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 50;
        bricks.push(new Brick(x, y, this.level));
      }
    }
    
    return bricks;
  }

  setupEventListeners() {
    const moveHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX || e.touches[0].clientX) - rect.left;
      this.paddle.move(mouseX);
    };

    this.canvas.addEventListener('mousemove', moveHandler);
    this.canvas.addEventListener('touchmove', moveHandler);
  }

  update() {
    if (this.gameOver) return;

    // Update balls
    this.balls.forEach((ball, index) => {
      if (!ball.active) return;

      ball.update();

      // Wall collisions
      if (ball.x + ball.dx > CANVAS_WIDTH - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      }

      // Paddle collision
      if (ball.y + ball.dy > this.paddle.y - ball.radius &&
          ball.x > this.paddle.x && 
          ball.x < this.paddle.x + this.paddle.width) {
        ball.dy = -ball.dy;
      }

      // Ball lost
      if (ball.y + ball.dy > CANVAS_HEIGHT - ball.radius) {
        ball.active = false;
        if (this.balls.every(b => !b.active)) {
          this.lives--;
          if (this.lives <= 0) {
            this.endGame();
          } else {
            this.resetBall();
          }
        }
      }

      // Brick collisions
      this.bricks.forEach(brick => {
        if (!brick.active) return;

        if (this.checkCollision(ball, brick)) {
          brick.active = false;
          ball.dy = -ball.dy;
          this.score += BRICK_POINTS;
          this.bricksDestroyed++;

          // Power-up chance
          if (Math.random() < (this.level <= 5 ? 0.1 : 0.07)) {
            const type = Math.random() < 0.6 ? 'bigBall' : 'multiBall';
            this.powerUps.push(new PowerUp(brick.x + brick.width / 2, brick.y, type));
          }
        }
      });
    });

    // Update power-ups
    this.powerUps.forEach(powerUp => {
      if (!powerUp.active) return;

      powerUp.update();

      // Paddle collision with power-up
      if (powerUp.y + powerUp.size > this.paddle.y &&
          powerUp.x > this.paddle.x &&
          powerUp.x < this.paddle.x + this.paddle.width) {
        powerUp.active = false;
        this.activatePowerUp(powerUp.type);
      }

      // Remove if fallen
      if (powerUp.y > CANVAS_HEIGHT) {
        powerUp.active = false;
      }
    });

    // Check level completion
    if (this.bricks.every(brick => !brick.active)) {
      this.nextLevel();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw game elements
    this.paddle.draw(this.ctx);
    this.balls.forEach(ball => ball.active && ball.draw(this.ctx));
    this.bricks.forEach(brick => brick.draw(this.ctx));
    this.powerUps.forEach(powerUp => powerUp.active && powerUp.draw(this.ctx));

    // Draw UI
    this.drawUI();
  }

  drawUI() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Level: ${this.level}`, 10, 60);
    
    // Draw lives
    for (let i = 0; i < this.lives; i++) {
      this.ctx.fillStyle = 'red';
      this.ctx.beginPath();
      this.ctx.arc(CANVAS_WIDTH - 30 - (i * 30), 30, 10, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.gameOver) {
      this.drawEndScreen();
    }
  }

  drawEndScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '40px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);

    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Final Score: ${this.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    this.ctx.fillText(`Levels Completed: ${this.level - 1}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    this.ctx.fillText(`Bricks Destroyed: ${this.bricksDestroyed}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);

    this.ctx.font = '16px Arial';
    this.ctx.fillText('Made by: not-cmd', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
  }

  checkCollision(ball, brick) {
    return ball.x > brick.x &&
           ball.x < brick.x + brick.width &&
           ball.y > brick.y &&
           ball.y < brick.y + brick.height;
  }

  activatePowerUp(type) {
    if (type === 'bigBall') {
      this.balls.forEach(ball => ball.setBigBall(true));
      setTimeout(() => {
        this.balls.forEach(ball => ball.setBigBall(false));
      }, 10000);
    } else if (type === 'multiBall' && this.balls.length < 3) {
      const newBall = new Ball(
        this.balls[0].x,
        this.balls[0].y,
        4 + this.level * 0.5
      );
      newBall.dx = -this.balls[0].dx;
      this.balls.push(newBall);
    }
  }

  resetBall() {
    this.balls = [new Ball(CANVAS_WIDTH / 2, this.paddle.y - 10, 4 + this.level * 0.5)];
  }

  nextLevel() {
    this.level++;
    this.bricks = this.createBricks();
    this.resetBall();
    this.powerUps = [];
  }

  endGame() {
    this.gameOver = true;
    this.saveHighScore();
  }

  loadHighScore() {
    this.highScore = localStorage.getItem('wallBreakerHighScore') || 0;
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      localStorage.setItem('wallBreakerHighScore', this.score);
    }
  }
}