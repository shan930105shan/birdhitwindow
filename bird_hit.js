let particles = [];
let feathers = [];
let birds = [];
let colors;
let bgImage;

let explosionImg;
let birdImgs = [];

let positions = [
  { x: 200, y: 150 },
  { x: 400, y: 300 },
  { x: 600, y: 200 }
];

let currentIndex = 0;

function preload() {
  birdImgs.push(loadImage("01.png"));
  birdImgs.push(loadImage("02.png"));
  birdImgs.push(loadImage("03.png"));
  bgImage = loadImage("city_bg.jpg");
}

function setup() {
  createCanvas(1000, 800);
  background(bgImage);
  colors = [
    color(0, 200, 200),
    color(0, 150, 150),
    color(180, 255, 240),
    color(255, 120, 60),
    color(255, 80, 0)
  ];
}

function draw() {
  background(0,0,255);
  tint(255, 600); // 透明度 30（類似 background(0, 30) 的效果）
  image(bgImage, width / 2, height / 2, width, height);
  tint(255, 255); // 還原透明度，避免影響後面圖層
  // 1. 羽毛（最底層）
  for (let i = feathers.length - 1; i >= 0; i--) {
    feathers[i].update();
    feathers[i].show();
    if (feathers[i].isFinished()) {
      feathers.splice(i, 1);
    }
  }

  // 2. 所有鳥的圖片（中層）
  imageMode(CENTER);
  for (let bird of birds) {
    bird.update();
    bird.show();
  }

  // 3. 爆炸粒子（最上層）
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    // 取得當前位置
    let pos = positions[currentIndex];

    // 爆炸粒子
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(pos.x, pos.y));
    }

    // 羽毛
    for (let i = 0; i < 30; i++) {
      let fx = pos.x + random(-100, 100);
      let fy = pos.y + random(-50, 50);
      feathers.push(new Feather(fx, fy));
    }

    // 隨機選擇一張鳥圖片
    let chosenImg = random(birdImgs);
    birds.push(new BirdImage(pos.x, pos.y, chosenImg));

    // 輪替到下一個位置
    currentIndex = (currentIndex + 1) % positions.length;
  }
}

// ---------- 粒子 ----------
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-10, 10);
    this.vy = random(-10, 10);
    this.alpha = 255;
    this.lifeSpan = random(10, 30);
    this.color = colors[int(random(colors.length))];
    this.size = random(6, 12);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifeSpan -= 2.5;
    this.alpha = map(this.lifeSpan, 0, 50, 0, 255);
  }

  show() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.lifeSpan <= 0;
  }
}

// ---------- 羽毛 ----------
class Feather {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.4, 0.4);
    this.vy = random(0.3, 0.8);
    this.alpha = 180;
    this.lifeSpan = random(200, 600);
    this.color = color(random(0, 100), random(150, 255), random(180, 255));
    this.sizeX = random(3, 5);
    this.sizeY = random(12, 24);
    this.angle = random(TWO_PI);
    this.spin = random(-0.02, 0.02);
  }

  update() {
    this.x += this.vx + sin(this.angle) * 0.3;
    this.y += this.vy;
    this.angle += this.spin;
    this.lifeSpan -= 3;
    this.alpha = map(this.lifeSpan, 0, 40, 0, 80);
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    ellipse(0, 0, this.sizeX, this.sizeY);
    pop();
  }

  isFinished() {
    return this.lifeSpan <= 0;
  }
}

// ---------- 鳥圖片（獨立放大動畫） ----------
class BirdImage {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.scale = 0.1;
    this.maxScale = 1;
    this.growth = 0.1;
    this.done = false;
  }

  update() {
    if (!this.done) {
      this.scale += this.growth;
      if (this.scale >= this.maxScale) {
        this.scale = this.maxScale;
        this.done = true;
      }
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    scale(this.scale);
    imageMode(CENTER);
    image(this.img, 0, 0, 200, 200);
     // 藍色濾鏡（R, G, B, Alpha）
    tint(255, 255, 255, 255); 

    image(this.img, 0, 0, 400, 400);
    noTint(); // 避免影響後面的 image
    pop();
  }
}

