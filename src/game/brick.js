import { BRICK_WIDTH, BRICK_HEIGHT, BRICK_PADDING, LEVEL_COLORS } from './constants.js';

export class Brick {
  constructor(x, y, level) {
    this.x = x;
    this.y = y;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.level = level;
    this.active = true;
  }

  draw(ctx) {
    if (!this.active) return;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = LEVEL_COLORS[this.level - 1];
    ctx.fill();
    ctx.closePath();
  }
}