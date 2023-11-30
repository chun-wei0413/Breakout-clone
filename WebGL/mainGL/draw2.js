var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//當按鈕被點擊時，restartGame 函數會被調用，這個函數將重新初始化遊戲相關的變數
document.getElementById("returnButton").addEventListener("click", returnGame);
// 載入下一個關卡的地方
let savedScore = localStorage.getItem("score");
let score;
if (savedScore !== null) {
  // 如果有存儲的分數，使用它
  score = parseInt(savedScore, 10);
  // 清除存儲的分數，避免下次再次使用
  localStorage.removeItem("score");
} else {
  // 如果沒有存儲的分數，進行默認的初始化
  score = 0;
}
//檢查左鍵是否按下發射球
let isBallLaunched = false;
//檢查是否在吃愛心的狀態
let isHeartState = false;
//檢查是否在吃星星的狀態
let isStarState = false;
//檢查遊戲是否結束
let isGameOver = false;
//是否勝利
let isWin = false;
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
let paddle = new Paddle(canvas.width / 2 - 50, canvas.height - 150, 100, 10);


//建立星星物件
class Star {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.dy = 2; // 星星下降的速度
  }
  //參考網址 https://juejin.cn/post/6844904193942093832
  draw() {
    // 繪製星星
    ctx.beginPath();
    var horn = 5; // 画5个角
    var angle = 360/horn; // 五个角的度数
    // 两个圆的半径
    var R = 25;
    var r = 10;
    // 坐标
    for (var i = 0; i < horn; i++) {
        // 角度转弧度：角度/180*Math.PI
        // 外圆顶点坐标
        ctx.lineTo(Math.cos((18 + i * angle) / 180 * Math.PI) * R + this.x, -Math.sin((18 + i * angle) / 180 * Math.PI) * R + this.y);
        // 內圆顶点坐标
        ctx.lineTo(Math.cos((54 + i * angle) / 180 * Math.PI) * r + this.x, -Math.sin((54 + i * angle) / 180 * Math.PI) * r + this.y);
    }
    // closePath：关闭路径，将路径的终点与起点相连
    ctx.closePath();

    ctx.fillStyle = '#E4EF00';
    ctx.strokeStyle = "#000000";
    ctx.fill();
    //繪製外框
    ctx.stroke();
  }

  move() {
    // 星星往下移動
    this.y += this.dy;
  }

  collide(paddle) {
    // 檢測星星與Paddle的碰撞
    if (
      this.x + this.size >= paddle.x &&
      this.x - this.size <= paddle.x + paddle.length &&
      this.y + this.size >= paddle.y &&
      this.y - this.size <= paddle.y + paddle.width
    ) {
      //星星碰到paddle會變色
      // Paddle的length加長50，但不超過某個最大值（例如，canvas.width - 10）
      if(paddle.length < 150){
        paddle.length += 50;
        isStarState = true;
        // 設定五秒後恢復原狀
        // 每次碰撞都重新計時
        setTimeout(() => {
          paddle.length -= 50;
          isStarState = false;
        }, 10000);
      }
      // 移除碰撞的星星
      stars.splice(stars.indexOf(this), 1);
      score+=10;
    }
  }

}

let stars = [];  //存放星星的陣列
//建立星星物件



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

//笑臉物件
class Smile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dy = 2;
  }
  //參考網址 https://blog.csdn.net/m0_57301042/article/details/127882435
  draw() {
    // 繪製smile
    ctx.beginPath();
    //畫臉的圓，將半徑縮小為原來的 1/4
    ctx.arc(this.x, this.y, 50 / 4, Math.PI * 2, 0);
    ctx.moveTo(this.x + 35 / 4, this.y); // 將移動座標也縮小為原來的 1/4
    //畫嘴巴
    ctx.arc(this.x, this.y, 35 / 4, 0, Math.PI);
    ctx.moveTo(this.x + 35 / 4, this.y - 20 / 4); // 將移動座標也縮小為原來的 1/4
    //畫右眼
    ctx.arc(this.x + 25 / 4, this.y - 20 / 4, 10 / 4, 0, Math.PI, true);
    ctx.moveTo(this.x - 15 / 4, this.y - 20 / 4); // 將移動座標也縮小為原來的 1/4
    //畫左眼
    ctx.arc(this.x - 25 / 4, this.y - 20 / 4, 10 / 4, 0, Math.PI, true);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    // closePath：关闭路径，将路径的终点与起点相连
    ctx.closePath();
    //繪製外框
  }

  move() {
    // 愛心往下移動
    this.y += this.dy;
  }

  collide(paddle) {
    // 檢測愛心與Paddle的碰撞
    if (
      this.x + (50/4 * Math.sqrt(2)) >= paddle.x &&
      this.x - (50/4 * Math.sqrt(2)) <= paddle.x + paddle.length &&
      this.y + (50/4 * Math.sqrt(2)) >= paddle.y &&
      this.y - (50/4 * Math.sqrt(2)) <= paddle.y + paddle.width
    ) {
      //星星碰到paddle會變色
      // Paddle的length加長50，但不超過某個最大值（例如，canvas.width - 10）
      if(balls[0].dx !== 5 && balls[0].dy !== 5){
        balls[0].dx *=2;
        balls[0].dy *=2;
        // 設定五秒後恢復原狀
        // 每次碰撞都重新計時
        setTimeout(() => {
          balls[0].dx /= 2;
          balls[0].dy /= 2;
        }, 10000);
      }
      // 移除碰撞的星星
      smiles.splice(smiles.indexOf(this), 1);
      score-=5;
    }
  }
}

let smiles = [];//存放愛心陣列
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
    if ((this.y - this.radius) <= 0) {
      this.dy = -this.dy;
    }else if((this.y + this.radius) >= canvas.height){
      //碰到遊戲視窗下方就結束
      isGameOver = true;
    }
  }
 
  // 修改 move 函數，如果球還未發射，則讓球的 y 座標保持在 paddle 上方
  move() {
    if (!isBallLaunched) {
      this.x = paddle.x + paddle.length / 2;
      // Y軸留點距離，因為太近會影響初始碰撞判定
      this.y = paddle.y - this.radius - 10;
      return;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

//建立ball物件
let balls = [];
let ballHeight = 50;
//先產生一顆主球
balls.push(new Ball(0, 0, 2.5, 2.5, 10));

class Heart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dy = 2;
  }
  //參考網址 https://blog.csdn.net/m0_57301042/article/details/127882435
  draw() {
      // 繪製星星
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      //愛心右半邊
      ctx.bezierCurveTo(this.x+10,this.y-20,this.x+40,this.y,this.x,this.y+20);
      ctx.moveTo(this.x,this.y+20);
      //愛心左半邊
      ctx.bezierCurveTo(this.x-40,this.y,this.x-10,this.y-20,this.x,this.y);
      // closePath：关闭路径，将路径的终点与起点相连
      ctx.closePath();
      ctx.fillStyle = "#FF0000";
      ctx.fill();
      //繪製外框
      //ctx.stroke();
  }

  move() {
    // 愛心往下移動
    this.y += this.dy;
  }

  collide(paddle) {
    // 檢測愛心與Paddle的碰撞
    if (
      this.x + 20 >= paddle.x &&
      this.x - 20 <= paddle.x + paddle.length &&
      this.y + 20 >= paddle.y &&
      this.y - 20 <= paddle.y + paddle.width
    ) {
      //星星碰到paddle會變色
      // Paddle的length加長50，但不超過某個最大值（例如，canvas.width - 10）
        balls[0].radius = 20;
        isHeartState = true;
        // 設定五秒後恢復原狀
        // 每次碰撞都重新計時
        setTimeout(() => {
          balls[0].radius=10;
          isHeartState = false;
        }, 10000);

      // 移除碰撞的星星
      hearts.splice(hearts.indexOf(this), 1);
      score+=10;
    }
  }
}

let hearts = [];//存放愛心陣列

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
  collideAndDrop(ball) {
    if (
      ball.x + ball.radius >= this.x &&
      ball.x - ball.radius <= this.x + this.length &&
      ball.y + ball.radius >= this.y &&
      ball.y - ball.radius <= this.y + this.width
    ) {
      // 找到碰撞的 bar，並將其從陣列中移除
      for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars[i].length; j++) {
          if (bars[i][j] === this) {
            // 移除這個 bar
            bars[i].splice(j, 1);
            score+=10;
            // 球反彈
            ball.dy = -ball.dy;
            
            // 25% 的機率掉落道具
            if (Math.random() <= 0.5) {
              let Probability = Math.random();
              //Probability <= 0.33
              if(Probability <= 0.33){
                let star = new Star(this.x + this.length / 2, this.y + this.width / 2, 20);
                stars.push(star);
              }
              //Probability > 0.33 && Probability <= 0.66
              else if(Probability > 0.33 && Probability <= 0.66){
                let heart = new Heart(this.x + this.length / 2, this.y + this.width / 2);
                hearts.push(heart);
              }
              else{
                let smile = new Smile(this.x + this.length / 2, this.y + this.width / 2);
                smiles.push(smile);
              }
            }

            return; // 當找到並移除 bar 時，結束迴圈
          }
        }
      }
    }
  }
  //專門給路障的碰撞，不會消失也不掉寶
  collideForMoveBar(ball){
    if (
      ball.x + ball.radius >= this.x &&
      ball.x - ball.radius <= this.x + this.length &&
      ball.y + ball.radius >= this.y &&
      ball.y - ball.radius <= this.y + this.width
    ) {
      ball.dy = -ball.dy;
    }
  }
}
//路障
let moveBar = new Bar(canvas.width / 2 - 50, canvas.height - 400, 5,0 , 100, 10);
// 創建球的函數
/*function createBall() {
  let randomX = Math.random() * 20;
  //let dx = 5 * Math.pow(-1, 1);
  //let dy = -5 * Math.pow(-1, 1);
  let dx = 5,dy = 5;
  // 如果球還沒發射，則起始 y 座標為 paddle 上方
  let startY = isBallLaunched ? canvas.height - ballHeight: paddle.y - ballHeight;
   
  balls.push(new Ball(paddle.x + paddle.length / 2, startY, dx, dy, 10));
}
createBall();
*/

//此迴圈i可以控制球的數量
/*
  for(let i = 1; i <= 5; i++){   
    //let randomX = Math.random() * 20; // 產生 0 到 700 之間的隨機數
    let dx = 2.5 * Math.pow(-1, i); // 將 2.5 乘上 -1 的 i 次方，產生不同方向
    let dy = -2.5 * Math.pow(-1, i); // 將 -2.5 乘上 -1 的 i 次方，產生不同方向
    balls.push(new Ball(canvas.width/2, canvas.height - ballHeight*i, dx, dy, 10));
  }
*/

//磚塊物件的相對位置座標
let barLength = 150;
let barHeigth = 500;
//高度倍數
let heigthMultiple = 60;
// 地圖磚塊物件
let bars = [];

// 用2D array快速建立磚塊物件
for (let i = 1; i <= 1; i++) {
  let row = [];

  // 循環每一行中的物件
  for (let j = 1; j <= 1; j++) {
    let bar = new Bar(
      canvas.width+450 - ((9 - i) * barLength),
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
    for(let i =0; i < stars.length; i++){
      let star = stars[i];
      star.collide(paddle);
    }
    for(let i =0; i < hearts.length; i++){
      let heart = hearts[i];
      heart.collide(paddle);
    }
    for(let i =0; i < smiles.length; i++){
      let smile = smiles[i];
      smile.collide(paddle);
    }
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i];
      paddle.collide(ball);
    }
    // 检测球之间的相撞
    for (let i = 0; i < balls.length; i++) {
      /*for (let j = i + 1; j < balls.length; j++) {
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
      }*/

      // 检测球与Bar的碰撞
      let ball = balls[i];
      for (let k = 0; k < bars.length; k++) {
        for (let j = 0; j < bars[k].length; j++) {
          let bar = bars[k][j];
          bar.collideAndDrop(ball);
        }
      }

      moveBar.collideForMoveBar(ball);
    } 
}

//可以拿來控制球的顏色
let colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#A52A2A", "#008000", "#800080"];
let colorIndex = 0;  // 用於追蹤 colors 陣列的索引

function changePaddleColor() {
  // 當 isStarState 為 false 時，循環變更 paddle 的顏色
    paddle.draw(colors[colorIndex]);
    colorIndex = (colorIndex + 1) % colors.length;  // 循環選擇 colors 陣列的下一個顏色
}



function changeBallsColor() {
  // 當 isStarState 為 false 時，循環變更 paddle 的顏色
    balls[0].draw(colors[colorIndex]);
    colorIndex = (colorIndex + 1) % colors.length;  // 循環選擇 colors 陣列的下一個顏色
}
// 設定每 1000 毫秒執行一次 changePaddleColor 函數
setInterval(changePaddleColor, 1000);
setInterval(changeBallsColor, 1000);



function drawing() {

  //失敗判定
  if(isGameOver){
    printGameOver();
    //防止paddle結束時還有殘影
    paddle = null;
    //停止interval執行
    clearInterval(interval);
  }
  // 勝利判定
  if (isWin) {
      printFinalScore();
      printWin();
      // 防止 paddle 結束時還有殘影
      paddle = null;
      // 停止 interval 執行
      clearInterval(interval);
  }
  // 即時清空畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //顯示分數函式
  printScore();
  //處理物件之間的碰撞
  CollisionAmongObject();
  
  // 處理球與畫布間的碰撞
  for (let i = 0; i < balls.length; i++) {
    balls[i].collide();
    balls[i].move();
    balls[i].draw(colors[i]);
  }
  // 繪製star
  for (let i = 0; i < stars.length; i++) {
    stars[i].move();
    stars[i].draw();
  }
  //繪製愛心
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].move();
    hearts[i].draw();
  }
  //繪製笑臉
  for (let i = 0; i < smiles.length; i++) {
    smiles[i].move();
    smiles[i].draw();
  }
  //路障繪製與移動
  moveBar.draw("#000000");
  moveBar.collide();
  moveBar.move();
  // paddle吃寶物特效
  if(isStarState){
    changePaddleColor();
  }
  else{
    paddle.draw("#0000FF");
  }
  //ball 吃寶物特效


  // 顯示地圖所有磚塊
  for(let i=0; i<bars.length; i++){
    for (let j = 0; j < bars[i].length; j++) {
      bars[i][j].collide();
      //bars[i][j].move();
      bars[i][j].draw("#000000");
    }
  }

  //只有當 bars 中的每一行都是空的時候（每個 row 的長度都是零），isWin 才會被設置為 true。
  if(bars.every(row => row.length === 0)){
    isWin = true;
  }

}
function printScore(){
  // 顯示分數
  ctx.font = "20px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Score: " + score, canvas.width - 100, 30);
}
function printFinalScore(){ 
  // 顯示分數 
  ctx.font = "20px Arial"; 
  ctx.fillStyle = "#000000";
  ctx.fillText("Total Score:"+score ,(canvas.width / 2)-100, canvas.height / 3 + 50);
}
function printWin(){
    // 遊戲勝利時繪製標誌
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("YOU FINISH THE GAME!!", (canvas.width / 2)-200 , canvas.height / 3);
}
function returnGame() {
  // 重置遊戲相關變數
  isWin = false;

  isGameOver = false;
  isHeartState = false;
  isStarState - false;
  // 使用 window.location.href 跳轉回 index.html
  window.location.href = "index.html";

}
function printGameOver(){
  // 遊戲結束時繪製標誌
  ctx.font = "30px Arial";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("GAME OVER", canvas.width / 2 - 100 , canvas.height / 2);
}
setInterval(drawing, 10); // 定时刷新
