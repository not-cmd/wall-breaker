import { POWER_UP_SIZE, POWER_UP_SPEED } from './constants.js';

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = POWER_UP_SIZE;
    this.speed = POWER_UP_SPEED;
    this.active = true;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.type === 'bigBall' ? 'blue' : 'red';
    ctx.fill();
    ctx.closePath();
  }
}