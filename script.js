// Your JavaScript starts here

// ===== BACKGROUND MUSIC =====
const bgm = new Audio("https://files.catbox.moe/kxx785.mp3");
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
    startIdleJesterGlitches();
  }, 1800);
}

curtain.addEventListener("click", openCurtain);

curtain.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openCurtain();
});

// ===========================
// JESTER IDLE GLITCH (FRAME 1)
// ===========================

let glitchArmed = false;
let glitchPlaying = false;

function playJesterGlitch() {
  if (glitchPlaying) return;

  const img = document.getElementById("jesterFlash");
  if (!img) return;

  glitchPlaying = true;

  // restart animation cleanly
  img.classList.remove("flash");
  void img.offsetWidth; // forces reflow so animation can replay
  img.classList.add("flash");

  // animation lasts ~420ms
  setTimeout(() => {
    img.classList.remove("flash");
    glitchPlaying = false;
  }, 500);
}

function startIdleJesterGlitches() {
  if (glitchArmed) return;
  glitchArmed = true;

  // First “did I see that?” hit a couple seconds after entering
  setTimeout(() => {
    playJesterGlitch();
  }, 2500);

  // Then random glitches every ~8–22 seconds
  function loop() {
    const next = 8000 + Math.random() * 14000;
    setTimeout(() => {
      // 70% chance to play (keeps it rare/uncertain)
      if (Math.random() < 0.7) playJesterGlitch();
      loop();
    }, next);
  }

  loop();
}
