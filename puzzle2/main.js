const board = document.getElementById("game-board");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const bestTimeDisplay = document.getElementById("best-time");
const savedBest = localStorage.getItem("bestTime");
if (savedBest !== null) {
  bestTimeDisplay.textContent = `ベストタイム: ${savedBest}秒`;
}

let numbers = [...Array(25).keys()].map(n => n + 1);
numbers.sort(() => Math.random() - 0.5); // シャッフル

let current = 1;
let startTime = null;
let timerInterval = null;

for (let i = 0; i < 25; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.textContent = numbers[i];

cell.addEventListener("click", () => {
  const num = parseInt(cell.textContent);

  if (num === current) {
    if (num === 1) {
      // 1を押した瞬間にスタート
      startTime = Date.now();

      // 毎0.1秒ごとに経過時間を表示
      timerInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = ((now - startTime) / 1000).toFixed(2);
        timerDisplay.textContent = `タイム: ${elapsed}秒`;
      }, 100);
    }

    cell.classList.add("clicked");
    current++;

    restartBtn.style.display = "inline-block";

    if (num === 25 && startTime !== null) {
      const endTime = Date.now();
      const elapsed = ((endTime - startTime) / 1000).toFixed(2);
      message.textContent = "クリア！おめでとう！";
      timerDisplay.textContent = `タイム: ${elapsed}秒`;
      clearInterval(timerInterval);

      const currentBest = localStorage.getItem("bestTime");
      if (currentBest === null || elapsed < parseFloat(currentBest)) {
        localStorage.setItem("bestTime", elapsed);
        bestTimeDisplay.textContent = `ベストタイム: ${elapsed}秒`;
    }
  }
  } else {
    message.textContent = `ミス！ ${current} を押してください`;
  }
  restartBtn.addEventListener("click", () => {
  location.reload(); // ページをリロード（初期状態に戻る）
  });
  });

  board.appendChild(cell);
}
