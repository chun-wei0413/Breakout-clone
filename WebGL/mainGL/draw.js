var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

class Ball {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }

  draw(color) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  collide() {
    if ((this.x + this.radius) >= canvas.width || (this.x - this.radius) <= 0) {
      this.dx = -this.dx;
    }
    if ((this.y + this.radius) >= canvas.height || (this.y - this.radius) <= 0) {
      this.dy = -this.dy;
    }
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
}

class bar {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  draw(color) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, 50, 10);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
}
let ball1 = new Ball(canvas.width / 2, canvas.height - 30, 1, -1, 10);
let ball2 = new Ball(canvas.width / 2, canvas.height - 10, -1, 1, 10);

let bar1 = new bar(canvas.width / 2, canvas.height - 30, 1, -1);
function drawing() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 处理小球碰撞
  ball1.collide();

  // 移动和绘制小球
  ball1.move();
  ball1.draw("#000000");
  // 处理小球碰撞
  ball2.collide();

  // 移动和绘制小球
  ball2.move();
  ball2.draw("#FF0000");
  // 绘制条//
  bar1.draw("#FF0000");
}

setInterval(drawing, 10); // 定时刷新
