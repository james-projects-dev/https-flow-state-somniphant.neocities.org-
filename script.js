// ===========================
// BACKGROUND MUSIC
// ===========================
const bgm = new Audio(
  "https://waifuvault.moe/f/3b478d46-56ee-4054-91a8-23581095baf3/halftime_ambiance.mp3"
);
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
// CHARGE ANIMATION (9 FRAMES)
// ===========================
const CHARGE_FRAMES = [
  "assets/images/charge/frame1.webp",
  "assets/images/charge/frame2.webp",
  "assets/images/charge/frame3.webp",
  "assets/images/charge/frame4.webp",
  "assets/images/charge/frame5.webp",
  "assets/images/charge/frame6.webp",
  "assets/images/charge/frame7.webp",
  "assets/images/charge/frame8.webp",
  "assets/images/charge/frame9.webp",
];

let chargePlaying = false;

function preloadChargeFrames() {
  CHARGE_FRAMES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function playChargeAnimation(onDone) {
  // don't play until curtain opened
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

  const fps = 22;
  const frameDuration = 1000 / fps;

  let i = 0;
  frameImg.src = CHARGE_FRAMES[i];

  const timer = setInterval(() => {
    i++;
    if (i >= CHARGE_FRAMES.length) {
      clearInterval(timer);
      overlay.classList.remove("playing");
      chargePlaying = false;
      if (typeof onDone === "function") onDone();
      return;
    }
    frameImg.src = CHARGE_FRAMES[i];
  }, frameDuration);
}

// ===========================
// JESTER IDLE GLITCH
// ===========================
let glitchArmed = false;
let glitchPlaying = false;

function playJesterGlitch() {
  if (glitchPlaying) return;

  const img = document.getElementById("jesterFlash");
  if (!img) return;

  glitchPlaying = true;

  img.classList.remove("flash");
  void img.offsetWidth; // reflow to restart animation
  img.classList.add("flash");

  setTimeout(() => {
    img.classList.remove("flash");
    glitchPlaying = false;
  }, 500);
}

function startIdleJesterGlitches() {
  if (glitchArmed) return;
  glitchArmed = true;

  setTimeout(() => {
    playJesterGlitch();
  }, 2500);

  function loop() {
    const next = 8000 + Math.random() * 14000;
    setTimeout(() => {
      if (Math.random() < 0.7) playJesterGlitch();
      loop();
    }, next);
  }

  loop();
}

// ===========================
// CURTAIN OPEN
// ===========================
function openCurtain() {
  startMusic();

  const curtain = document.getElementById("curtain");
  if (!curtain || curtain.classList.contains("open")) return;

  curtain.classList.add("pull");

  setTimeout(() => {
    curtain.classList.add("open");
    document.body.classList.add("stage-open");
  }, 120);

  setTimeout(() => {
    curtain.style.display = "none";
    startIdleJesterGlitches();
    preloadChargeFrames();
  }, 1800);
}

// ===========================
// STARTUP + EVENTS
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("Website loaded!");

  preloadChargeFrames();

  // Mute button
  const muteBtn = document.getElementById("muteBtn");
  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      bgm.muted = !bgm.muted;
      muteBtn.textContent = bgm.muted ? "🔇" : "🔊";
    });
  }

  // Curtain events
  const curtain = document.getElementById("curtain");
  if (curtain) {
    curtain.addEventListener("click", openCurtain);
    curtain.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openCurtain();
    });
  }

  // Firefox-safe nav hover detection (for Home glow behavior)
  const nav = document.getElementById("marqueeNav");
  if (nav) {
    nav.addEventListener("mouseover", (e) => {
      const btn = e.target.closest(".marqueeBtn");
      if (!btn) return;
      if (btn.dataset.label !== "Home") document.body.classList.add("nav-hovering");
    });

    nav.addEventListener("mouseout", (e) => {
      const related = e.relatedTarget;
      if (!nav.contains(related)) document.body.classList.remove("nav-hovering");
    });
  }
});

// ===========================
// NAV CLICK => CHARGE => NAVIGATE
// ===========================
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".marqueeBtn");
  if (!btn) return;

  // Disable Home click on home page
  if (document.body.classList.contains("page-home") && btn.dataset.label === "Home") {
    return;
  }

  e.preventDefault();

  const href = btn.getAttribute("href");
  playChargeAnimation(() => {
    if (!href) return;

    if (href.startsWith("#")) {
      location.hash = href;
    } else {
      window.location.href = href;
    }
  });
});
