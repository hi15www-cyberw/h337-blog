const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// простые цвета вместо картинок (чтобы точно работало)
let player = {
  x: 130,
  y: 450,
  w: 60,
  h: 100,
  speed: 6
};

let enemies = [];

// управление
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
});

// враги
function spawnEnemy() {
  enemies.push({
    x: Math.random() * 260,
    y: -100,
    w: 60,
    h: 100
  });
}

// столкновение
function crash(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// игра
function game() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // фон
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // игрок
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // враги
  ctx.fillStyle = "white";
  enemies.forEach((enemy, i) => {
    enemy.y += 3;
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

    if (enemy.y > 600) enemies.splice(i, 1);

    if (crash(player, enemy)) {
      alert("Game Over");
      location.reload();
    }
  });

  requestAnimationFrame(game);
}

// запуск
setInterval(spawnEnemy, 1500);
game();
