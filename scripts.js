(function(){
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');

  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;

  // CONFIG CỐ ĐỊNH
  const cfg = {
    density: 600,
    baseWind: 0,
    speed: 3,
    gravity: 0.02,
    maxSize: 10,
    minSize: 3
  };

  // WIND THEO HƯỚNG CHUỘT
  let mouseWind = 0;
  document.addEventListener('mousemove', e=>{
    const centerX = W/2;
    mouseWind = (e.clientX - centerX) / centerX * 1.5;
  });

  class Flake{
    constructor(){ this.reset(true); }
    reset(top=false){
      this.size = Math.random()*(cfg.maxSize-cfg.minSize)+cfg.minSize;
      this.x = Math.random()*W;
      this.y = top ? -10 : Math.random()*H;
      this.velY = Math.random()*0.5 + 0.3;
      this.velX = (Math.random()-0.5)*0.5;
      this.opacity = Math.random()*0.6+0.4;
    }
    update(){
      const wind = cfg.baseWind + mouseWind;
      this.x += (this.velX + wind) * cfg.speed;
      this.y += this.velY * cfg.speed;

      if (this.y > H+10) this.reset(true);
      if (this.x < -50) this.x = W+20;
      if (this.x > W+50) this.x = -20;
    }
    draw(ctx){
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
    }
  }

  let flakes = [];
  for (let i=0; i<cfg.density; i++) flakes.push(new Flake());

  function loop(){
    ctx.clearRect(0,0,W,H);
    for (const f of flakes){
      f.update();
      f.draw(ctx);
    }
    requestAnimationFrame(loop);
  }

  loop();

  window.addEventListener('resize', ()=>{
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  });
})();
const canvas = document.getElementById('cloudCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let clouds = [];
const cloudCount = 40;        // tăng số mây
const cloudMinY = 20;         // độ cao mây trên
const cloudMaxY = 100;
const wind = 0.5;             // hướng gió: + sang phải, - sang trái

// Tạo mây rải đều
for (let i = 0; i < cloudCount; i++) {
    const size = 40 + Math.random() * 40;
    const y = cloudMinY + Math.random() * (cloudMaxY - cloudMinY);
    const x = Math.random() * canvas.width;
    clouds.push({ x, y, size });
}

// Vẽ 1 đám mây
function drawCloud(c) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size * 0.5, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 0.5, c.y + 5, c.size * 0.4, 0, Math.PI * 2);
    ctx.arc(c.x - c.size * 0.5, c.y + 5, c.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
}

// Update mây
function updateClouds() {
    clouds.forEach(c => {
        c.x += wind;

        // Wrap-around khi ra khỏi màn hình
        if (wind > 0 && c.x - c.size > canvas.width) c.x = -c.size;
        if (wind < 0 && c.x + c.size < 0) c.x = canvas.width + c.size;

        drawCloud(c);
    });
}

// Main loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateClouds();
    requestAnimationFrame(animate);
}

animate();
