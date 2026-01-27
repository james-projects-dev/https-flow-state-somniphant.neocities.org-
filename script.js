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

// ===========================
// CHARGE ANIMATION (9 FRAMES)
// ===========================

const CHARGE_FRAMES = [
  "assets/images/charge/frame1.png",
  "assets/images/charge/frame2.png",
  "assets/images/charge/frame3.png",
  "assets/images/charge/frame4.png",
  "assets/images/charge/frame5.png",
  "assets/images/charge/frame6.png",
  "assets/images/charge/frame7.png",
  "assets/images/charge/frame8.png",
  "assets/images/charge/frame9.png",
];

let chargePlaying = false;

function preloadChargeFrames() {
  CHARGE_FRAMES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function playChargeAnimation(onDone) {
  // don’t play until curtain opened
  if (!document.body.classList.contains("stage-open")) {
    if (typeof onDone === "function") onDone();
    return;
  }

  if (chargePlaying) return;
  chargePlaying = true;

  const overlay = document.getElementById("chargeOverlay");
  const frameImg = document.getElementById("chargeFrame");
  if (!overlay || !frameImg) {
    chargePlaying = false;
    if (typeof onDone === "function") onDone();
    return;
  }

  overlay.classList.add("playing");

  // Aggressive lunge feel: fast FPS
  const fps = 22;                // you can tweak: 18–30
  const frameDuration = 1000 / fps;

  let i = 0;
  frameImg.src = CHARGE_FRAMES[i];

  const timer = setInterval(() => {
    i++;
    if (i >= CHARGE_FRAMES.length) {
      clearInterval(timer);

      // quick fade out
      overlay.classList.remove("playing");

      chargePlaying = false;
      if (typeof onDone === "function") onDone();
      return;
    }

    frameImg.src = CHARGE_FRAMES[i];
  }, frameDuration);
}

document.addEventListener("DOMContentLoaded", () => {
  preloadChargeFrames();

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
    document.body.classList.add("stage-open");
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


// ===========================
// NAV CLICK => CHARGE ANIM
// ===========================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".marqueeBtn");
  if (!btn) return;

  e.preventDefault(); // stop instant jump

  const targetHash = btn.getAttribute("href"); // like "#about"

  playChargeAnimation(() => {
    // after animation finishes, navigate
    if (targetHash && targetHash.startsWith("#")) {
      location.hash = targetHash;
    }
  });
});


