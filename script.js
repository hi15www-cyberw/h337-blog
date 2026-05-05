const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 🚗 ИГРОК
let player = {
  x: 130,
  y: 450,
  w: 50,
  h: 100,
  speed: 6
};

// 👾 ВРАГИ
let enemies = [];

let gameSpeed = 3;

// 📱 УПРАВЛЕНИЕ
canvas.addEventListener("touchmove", function(e) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  player.x = touch.clientX - rect.left - player.w / 2;
});

// 👾 СПАВН
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 50),
    y: -100,
    w: 50,
    h: 100
  });

  setTimeout(spawnEnemy, 1200);
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

// 🚗 РИСУЕМ МАШИНУ (КРАСИВО)
function drawCar(x, y, color, glow) {
  ctx.save();

  // неон
  ctx.shadowColor = glow;
  ctx.shadowBlur = 20;

  // корпус
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 50, 100);

  // стекло
  ctx.fillStyle = "#222";
  ctx.fillRect(x + 10, y + 15, 30, 25);

  // фары
  ctx.fillStyle = "yellow";
  ctx.fillRect(x + 5, y, 10, 10);
  ctx.fillRect(x + 35, y, 10, 10);

  ctx.restore();
}

// 🎨 ИГРА
function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // дорога
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // разметка
  ctx.fillStyle = "white";
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.fillRect(canvas.width / 2 - 2, i + (Date.now()/10 % 40), 4, 20);
  }

  // 🚗 игрок
  drawCar(player.x, player.y, "red", "red");

  // 👾 враги
  enemies.forEach((enemy, i) => {
    enemy.y += gameSpeed;

    drawCar(enemy.x, enemy.y, "cyan", "cyan");

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

  requestAnimationFrame(game);
}

// 🚀 СТАРТ
spawnEnemy();
game();
