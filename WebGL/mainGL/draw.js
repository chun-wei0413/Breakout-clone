var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


// Paddle 物件描述
class Paddle {
  constructor(x, y, length, width) {
    this.x = x;
    this.y = y;
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

  move(mouseX) {
    // 移動 paddle 的 x 座標至滑鼠的 x 座標
    this.x = mouseX - this.length / 2;

    // 防止 paddle 超出 canvas 邊界
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.length > canvas.width) {
      this.x = canvas.width - this.length;
    }
  }
  //paddle與球碰撞
  collide(ball) {
    if (
      ball.x + ball.radius >= this.x &&
      ball.x - ball.radius <= this.x + this.length &&
      ball.y + ball.radius >= this.y &&
      ball.y - ball.radius <= this.y + this.width
    ) {
      ball.dy = -ball.dy; // 球反彈
    }
  }
}

// 建立 paddle 物件
let paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 100, 100, 10);

// 監聽滑鼠移動事件
canvas.addEventListener("mousemove", (event) => {
  // 計算滑鼠相對於 canvas 的 x 座標
  let mouseX = event.clientX - canvas.getBoundingClientRect().left;
  
  // 移動 paddle
  paddle.move(mouseX);
});
//當按下左鍵時改變 isBallLaunched
canvas.addEventListener("mousedown", () => {
  isBallLaunched = true;
});

//main Ball 物件描述
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
 
  // 修改 move 函數，如果球還未發射，則讓球的 y 座標保持在 paddle 上方
  move() {
    if (!isBallLaunched) {
      this.x = paddle.x + paddle.length / 2;
      this.y = paddle.y - this.radius;
      return;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

//Bar 物件描述
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
//建立ball物件
let balls = [];
let ballHeight = 50;
let isBallLaunched = false;
// 創建球的函數
function createBall() {
  let randomX = Math.random() * 20;
  let dx = 2.5 * Math.pow(-1, 1);
  let dy = -2.5 * Math.pow(-1, 1);

  // 如果球還沒發射，則起始 y 座標為 paddle 上方
  let startY = isBallLaunched ? canvas.height - ballHeight : paddle.y - ballHeight;
   
  balls.push(new Ball(paddle.x + paddle.length / 2, startY, dx, dy, 10));
}
createBall();
/*
//此迴圈i可以控制球的數量
for(let i = 1; i <= 1; i++){   
  let randomX = Math.random() * 20; // 產生 0 到 700 之間的隨機數
  let dx = 2.5 * Math.pow(-1, i); // 將 2.5 乘上 -1 的 i 次方，產生不同方向
  let dy = -2.5 * Math.pow(-1, i); // 將 -2.5 乘上 -1 的 i 次方，產生不同方向
  balls.push(new Ball(canvas.width / randomX, canvas.height - ballHeight*i, dx, dy, 10));
}*/

//磚塊物件的相對位置座標
let barLength = 100;
let barHeigth = 700;
//高度倍數
let heigthMultiple = 20;
// 地圖磚塊物件
let bars = [];

// 用2D array快速建立磚塊物件
for (let i = 1; i <= 8; i++) {
  let row = [];

  // 循環每一行中的物件
  for (let j = 1; j <= 9; j++) {
    let bar = new Bar(
      canvas.width - (9 - i) * barLength,
      canvas.height - barHeigth - heigthMultiple * j,
      -1,
      0,
      80,
      10
    );
    row.push(bar);
  }

  // 將一行的物件加入到 bars 陣列中
  bars.push(row);
}



function CollisionAmongObject() {
  // 检测球和 paddle 的碰撞
  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    paddle.collide(ball);
  }
  // 检测球之间的相撞
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let ball1 = balls[i];
      let ball2 = balls[j];
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
    }

    // 检测球与Bar的碰撞
    let ball = balls[i];
    for (let k = 0; k < bars.length; k++) {
      let barsToRemove = [];
      for (let j = 0; j < bars[k].length; j++) {
        let bar = bars[k][j];

        if (
          ball.x + ball.radius >= bar.x &&
          ball.x - ball.radius <= bar.x + bar.length &&
          ball.y + ball.radius >= bar.y &&
          ball.y - ball.radius <= bar.y + bar.width
        ) {
          // 球与bar碰撞时，标记Bar以便移除
          barsToRemove.push({ row: k, index: j });
          ball.dy = -ball.dy;
        }
      }

      // 移除碰撞的Bar
      for (let m = barsToRemove.length - 1; m >= 0; m--) {
        let { row, index } = barsToRemove[m];
        bars[row].splice(index, 1);
      }

    }
  }
}

//可以拿來控制球的顏色
let colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#A52A2A", "#008000", "#800080"];

function drawing() {
  // 即時清空畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //處理物件之間的碰撞
  CollisionAmongObject();
  // 處理球與畫布間的碰撞
  for (let i = 0; i < balls.length; i++) {
    balls[i].collide();
    balls[i].move();
    balls[i].draw(colors[i]);
  }
  // 繪製 paddle
  paddle.draw("#000000");
  // 顯示地圖所有磚塊
  for(let i=0; i<bars.length; i++){
    for (let j = 0; j < bars[i].length; j++) {
      bars[i][j].collide();
      //bars[i][j].move();
      bars[i][j].draw("#000000");
    }
  }
}

setInterval(drawing, 10); // 定时刷新
