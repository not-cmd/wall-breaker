import { BALL_RADIUS } from './constants.js';

export class Ball {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.dx = speed;
    this.dy = -speed;
    this.radius = BALL_RADIUS;
    this.active = true;
    this.color = 'white';
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  setBigBall(active) {
    this.radius = active ? BALL_RADIUS * 2 : BALL_RADIUS;
    this.color = active ? 'blue' : 'white';
  }
}