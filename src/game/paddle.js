import { PADDLE_WIDTH, PADDLE_HEIGHT, CANVAS_WIDTH } from './constants.js';

export class Paddle {
  constructor() {
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.x = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    this.y = CANVAS_HEIGHT - PADDLE_HEIGHT - 10;
  }

  move(mouseX) {
    this.x = Math.max(0, Math.min(CANVAS_WIDTH - this.width, mouseX - this.width / 2));
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 8);
    ctx.fillStyle = '#808080';
    ctx.fill();
    ctx.closePath();
  }
}