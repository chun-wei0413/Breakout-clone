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

class Bar {
  constructor(x, y, dx, dy, length, width) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.length = length;
    this.width = width;
  }

  draw(color) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.length, this.width);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  collide() {
    // bar的x座標在最左邊
    if (this.x + this.length >= canvas.width || this.x <= 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.width / 2 >= canvas.height || this.y - this.width / 2 <= 0) {
      this.dy = -this.dy;
    }
  }
}

let ball1 = new Ball(canvas.width / 2, canvas.height - 100, 1, -5, 25);
let ball2 = new Ball(canvas.width / 2, canvas.height - 300, -1, 4, 25);

//你好
//你好
// 生成多个 bar
let bars = [
  new Bar(canvas.width / 4, canvas.height - 50, 2, 0, 100, 10),
  new Bar(canvas.width / 4, canvas.height - 550, -1, 0, 80, 10),
  new Bar(canvas.width / 4, canvas.height - 530, -1, 0, 80, 10),
  new Bar(canvas.width / 4, canvas.height - 510, -1, 0, 80, 10),
  // Add more bars as needed
];

function CollisionAmongObject() {
  // 检测球之间的碰撞
  let distanceX = ball1.x - ball2.x;
  let distanceY = ball1.y - ball2.y;
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  if (distance < ball1.radius + ball2.radius) {
    // 两球相撞，交换它们的速度
    let tempDx = ball1.dx;
    let tempDy = ball1.dy;
    ball1.dx = ball2.dx;
    ball1.dy = ball2.dy;
    ball2.dx = tempDx;
    ball2.dy = tempDy;
  }

  // 检测球与条的碰撞
  for (let i = 0; i < bars.length; i++) {
    let bar = bars[i];
    if (
      ball1.x + ball1.radius > bar.x &&
      ball1.x - ball1.radius < bar.x + bar.length &&
      ball1.y + ball1.radius > bar.y &&
      ball1.y - ball1.radius < bar.y + bar.width
    ) {
      // 球1与条碰撞，反弹，并移除条
      ball1.dy = -ball1.dy;
      if(i!=0)//mainBar不能刪
        bars.splice(i, 1);
    }

    if (
      ball2.x + ball2.radius > bar.x &&
      ball2.x - ball2.radius < bar.x + bar.length &&
      ball2.y + ball2.radius > bar.y &&
      ball2.y - ball2.radius < bar.y + bar.width
    ) {
      // 球2与条碰撞，反弹，并移除条
      ball2.dy = -ball2.dy;
      if(i!=0)//mainBar不能刪
        bars.splice(i, 1);
    }
  }
}

function drawing() {
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 处理小球碰撞
  ball1.collide();
  ball2.collide();
  CollisionAmongObject();

  // 移动和绘制小球
  ball1.move();
  ball1.draw("#000000");

  // 移动和绘制小球
  ball2.move();
  ball2.draw("#FF0000");

  // 绘制所有的条
  for (let i = 0; i < bars.length; i++) {
    bars[i].collide();
    bars[i].move();
    bars[i].draw("#000000");
  }
}

setInterval(drawing, 10); // 定时刷新
