const player = document.getElementById("player");
const game = document.getElementById("game");
const fire = document.getElementById("fire");

let x = 130;
let running = false;
let score = 0;

let coins = parseInt(localStorage.getItem("coins")) || 0;
let speedLevel = parseInt(localStorage.getItem("speed")) || 1;
let nitroLevel = parseInt(localStorage.getItem("nitro")) || 1;

let nitro = 100;
let usingNitro = false;

// UI
function updateUI(){
  coinsEl.innerText = "💰 " + coins;
  stats.innerText = "Speed: "+speedLevel+" | Nitro: "+nitroLevel;
}

// MENU
function start(){
  menu.style.display="none";
  running=true;
}

function openGarage(){
  menu.style.display="none";
  garage.style.display="flex";
}

function closeGarage(){
  garage.style.display="none";
  menu.style.display="flex";
}

function openUpgrades(){
  menu.style.display="none";
  upgrades.style.display="flex";
  updateUI();
}

function closeUpgrades(){
  upgrades.style.display="none";
  menu.style.display="flex";
}

// GARAGE
let cars = ["🚗","🚙","🏎"];
let owned = JSON.parse(localStorage.getItem("owned")) || [true,false,false];
let selected = localStorage.getItem("selected") || 0;
player.innerText = cars[selected];

function buyCar(i){
  if(owned[i]){
    selected = i;
    localStorage.setItem("selected", i);
    player.innerText = cars[i];
    return;
  }

  let price = [0,50,100][i];

  if(coins >= price){
    coins -= price;
    owned[i]=true;
    save();
  } else alert("Нет денег");
}

// UPGRADES
function upgradeSpeed(){
  if(coins<20) return;
  coins-=20;
  speedLevel++;
  save();
  updateUI();
}

function upgradeNitro(){
  if(coins<30) return;
  coins-=30;
  nitroLevel++;
  save();
  updateUI();
}

function save(){
  localStorage.setItem("coins", coins);
  localStorage.setItem("speed", speedLevel);
  localStorage.setItem("nitro", nitroLevel);
  localStorage.setItem("owned", JSON.stringify(owned));
}

// CONTROL
document.addEventListener("touchmove", e=>{
  x = e.touches[0].clientX - 30;
});

// NITRO BUTTON
nitroBtn.onclick = ()=>{
  if(nitro>10){
    usingNitro=true;

    fire.style.opacity=1;
    player.classList.add("nitroActive");
    game.classList.add("shake");

    setTimeout(()=>{
      usingNitro=false;
      fire.style.opacity=0;
      player.classList.remove("nitroActive");
      game.classList.remove("shake");
    },1200);
  }
};

// ENEMIES
setInterval(()=>{
  if(!running) return;

  let e=document.createElement("div");
  e.className="enemy";
  e.style.left=Math.random()*260+"px";
  game.appendChild(e);
},800);

// LOOP
function loop(){
  if(running){

    player.style.left = x + "px";

    let gameSpeed = 4 + speedLevel;

    if(usingNitro){
      gameSpeed += 10 + nitroLevel*2;
      nitro -= 2;
      document.body.classList.add("speed");
    }else{
      document.body.classList.remove("speed");
    }

    document.querySelectorAll(".enemy").forEach(el=>{
      let top=el.offsetTop;
      el.style.top=top+gameSpeed+"px";

      if(
        el.offsetTop+80>460 &&
        el.offsetLeft<x+50 &&
        el.offsetLeft+50>x
      ){
        running=false;
        coins+=Math.floor(score/5);
        save();
        alert("💥 Game Over");
        location.reload();
      }

      if(top>600) el.remove();
    });

    score++;
    scoreEl.innerText=score;

    // nitro reload
    if(!usingNitro && nitro<100){
      nitro+=0.3*nitroLevel;
    }

    nitroBar.style.width = nitro + "%";
  }

  requestAnimationFrame(loop);
}

loop();
