// Your JavaScript starts here

// ===== BACKGROUND MUSIC =====
const bgm = new Audio("https://files.catbox.moe/8hrjh3.mp3");
bgm.loop = true;
bgm.preload = "auto";

let musicStarted = false;

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  bgm.volume = 0;
  bgm.play();

  let v = 0;
  const fade = setInterval(() => {
    v += 0.02;
    bgm.volume = Math.min(v, 0.8);
    if (v >= 0.8) clearInterval(fade);
  }, 100);
}
// ===========================


document.addEventListener("DOMContentLoaded", () => {
  const muteBtn = document.getElementById("muteBtn");

  if (!muteBtn) {
    console.log('Mute button not found. Add: <button id="muteBtn">Mute</button> in your HTML.');
    return;
  }

  muteBtn.addEventListener("click", () => {
    bgm.muted = !bgm.muted;
    muteBtn.textContent = bgm.muted ? "🔇" : "🔊";
  });

});



console.log("Website loaded!");

const curtain = document.getElementById("curtain");



function openCurtain() {
  startMusic();  

  if (!curtain || curtain.classList.contains("open")) return;

  // Small “tug” first (feels like someone grabbed it)
  curtain.classList.add("pull");

  setTimeout(() => {
    curtain.classList.add("open");
  }, 120);

  // Remove overlay after it finishes opening
  setTimeout(() => {
    curtain.style.display = "none";
  }, 1800);
}

curtain.addEventListener("click", openCurtain);

curtain.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openCurtain();
});

