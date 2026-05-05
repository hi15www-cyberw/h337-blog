const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🚗 КАРТИНКИ МАШИН (с интернета)
const playerCar = new Image();
playerCar.src = "https://upload.wikimedia.org/wikipedia/commons/3/33/Red_Bull_Racing_RB19.jpg";

const enemyCar = new Image();
enemyCar.src = "https://upload.wikimedia.org/wikipedia/commons/6/6e/Mercedes_W14_Formula_One_car.jpg";

// 🎮 ИГРОК
let player = {
  x: 130,
  y: 420,
  w: 70,
  h: 120,
  speed: 6
};

// 👾 ВРАГИ
let enemies = [];

// ⚡ СКОРОСТЬ
let gameSpeed = 3;
let difficulty = 0;

// 🎯 УПРАВЛЕНИЕ (мобильное)
document.addEventListener("touchmove", e => {
  player.x = e.touches[0].clientX - 50;
});

// ⌨️ ПК управление
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});

// 🚨 СПАВН ВРАГОВ
function spawnEnemy() {
  enemies.push({
    x: Math.random() * 250,
    y: -120,
    w: 70,
    h: 120
  });

  // сложность растет
  let delay = Math.max(600, 2000 - difficulty);
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

// 🎨 РЕНДЕР
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // дорога
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🚗 игрок
  ctx.drawImage(playerCar, player.x, player.y, player.w, player.h);

  // 👾 враги
  enemies.forEach((enemy, i) => {
    enemy.y += gameSpeed;

    ctx.drawImage(enemyCar, enemy.x, enemy.y, enemy.w, enemy.h);

    // удаление
    if (enemy.y > 600) {
      enemies.splice(i, 1);
    }

    // столкновение
    if (crash(player, enemy)) {
      alert("💥 Game Over!");
      location.reload();
    }
  });

  // рост сложности
  difficulty += 0.5;
  gameSpeed += 0.002;

  requestAnimationFrame(draw);
}

// 🚀 СТАРТ
spawnEnemy();
draw();
