// Your JavaScript starts here

console.log("Website loaded!");

const curtain = document.getElementById("curtain");

function openCurtain() {
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

