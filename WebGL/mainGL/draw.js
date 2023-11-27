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

let ball1 = new Ball(canvas.width / 2, canvas.height - 100, 5, -5, 25);
let ball2 = new Ball(canvas.width / 2, canvas.height - 300, -5, 5, 25);

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
  for (let j = 1; j <= 6; j++) {
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
  // 檢測球之間的相撞
  let distanceX = ball1.x - ball2.x;
  let distanceY = ball1.y - ball2.y;
  let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  if (distance < ball1.radius + ball2.radius) {
    // 兩球相撞，交換他們速度
    let tempDx = ball1.dx;
    let tempDy = ball1.dy;
    ball1.dx = ball2.dx;
    ball1.dy = ball2.dy;
    ball2.dx = tempDx;
    ball2.dy = tempDy;
  }
 
  // 检测球与Bar的碰撞
  for (let i = 0; i < bars.length; i++) {
    //用一陣列檢測被移除的bar
    let barsToRemove = [];

    for (let j = 0; j < bars[i].length; j++) {
      let bar = bars[i][j];

      // 碰撞检测
      //一定要>=或<= 不然碰撞判定容易一次撞掉多個bar
      if (
        ball1.x + ball1.radius >= bar.x &&
        ball1.x - ball1.radius <= bar.x + bar.length &&
        ball1.y + ball1.radius >= bar.y &&
        ball1.y - ball1.radius <= bar.y + bar.width
      ) {
        // 球1与bar碰撞时，标记Bar以便移除
        barsToRemove.push(j);
        ball1.dy = -ball1.dy;
      }

      if (
        ball2.x + ball2.radius >= bar.x &&
        ball2.x - ball2.radius <= bar.x + bar.length &&
        ball2.y + ball2.radius >= bar.y &&
        ball2.y - ball2.radius <= bar.y + bar.width
      ) {
        // 球2与bar碰撞时，标记Bar以便移除
        barsToRemove.push(j);
        ball2.dy = -ball2.dy;
      }
    }

    // 移除碰撞的Bar
    for (let k = barsToRemove.length - 1; k >= 0; k--) {
      bars[i].splice(barsToRemove[k], 1);
    }
  }
}

function drawing() {
  // 即時清空畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //處理物件之間的碰撞
  CollisionAmongObject();
  // 處理球與畫布間的碰撞
  ball1.collide();
  ball2.collide();
  // 繪製與移動球
  ball1.move();
  ball1.draw("#000000");

  ball2.move();
  ball2.draw("#FF0000");
  

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
