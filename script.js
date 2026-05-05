const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🚗 КАРТИНКИ
const playerCar = new Image();
playerCar.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Red_Bull_Racing_RB19.jpg";

const enemyCar = new Image();
enemyCar.src = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Mercedes_W14_Formula_One_car.jpg";

// 🎮 ИГРОК
let player = {
  x: 130,
  y: 450,
  w: 70,
  h: 120,
  speed: 6
};

// 👾 ВРАГИ
let enemies = [];

// ⚡ ИГРА
let gameSpeed = 3;
let difficulty = 0;

// 📱 УПРАВЛЕНИЕ (телефон)
canvas.addEventListener("touchmove", function(e) {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  let x = touch.clientX - rect.left;
  player.x = x - player.w / 2;
});

// ⌨️ ПК
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});

// 👾 СПАВН
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 70),
    y: -120,
    w: 70,
    h: 120
  });

  let delay = Math.max(500, 1500 - difficulty);
  setTimeout(spawnEnemy, delay);
}

// 💥 СТОЛКНОВЕНИЕ
function crash(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// 🎨 РИСОВАНИЕ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // дорога
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // разметка дороги
  ctx.fillStyle = "white";
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.fillRect(canvas.width / 2 - 2, i + (Date.now()/10 % 40), 4, 20);
  }

  // 🚗 НЕОН ПОД ИГРОКОМ
  ctx.shadowColor = "red";
  ctx.shadowBlur = 20;
  ctx.drawImage(playerCar, player.x, player.y, player.w, player.h);
  ctx.shadowBlur = 0;

  // 👾 ВРАГИ
  enemies.forEach((enemy, i) => {
    enemy.y += gameSpeed;

    ctx.shadowColor = "cyan";
    ctx.shadowBlur = 15;
    ctx.drawImage(enemyCar, enemy.x, enemy.y, enemy.w, enemy.h);
    ctx.shadowBlur = 0;

    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
    }

    if (crash(player, enemy)) {
      alert("💥 Game Over!");
      location.reload();
    }
  });

  // границы
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
  }

  // сложность
  difficulty += 0.3;
  gameSpeed += 0.001;

  requestAnimationFrame(draw);
}

// 🚀 СТАРТ
spawnEnemy();
draw();
