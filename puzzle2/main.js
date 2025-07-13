let startTime = null;
let timerInterval = null;
let current = 1;

function createGame(gridSize) {
  const board = document.getElementById("game-board");
  const message = document.getElementById("message");
  const timerDisplay = document.getElementById("timer");
  const bestTimeDisplay = document.getElementById("best-time");
  const restartBtn = document.getElementById("restartBtn");

  board.innerHTML = "";
  message.textContent = "";
  timerDisplay.textContent = "タイム: 0.00秒";
  restartBtn.style.display = "none";
  clearInterval(timerInterval);
  current = 1;
  startTime = null;

  // グリッド設定
  board.style.display = "grid";
  board.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;

  const maxNum = gridSize * gridSize;
  let numbers = [...Array(maxNum).keys()].map(n => n + 1);
  numbers.sort(() => Math.random() - 0.5);

  // ベストタイム表示
  const key = `bestTime${gridSize}`;
  const savedBest = localStorage.getItem(key);
  bestTimeDisplay.textContent = savedBest ? `ベストタイム: ${savedBest}秒` : "ベストタイム: -- 秒";

  for (let i = 0; i < maxNum; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = numbers[i];

    cell.addEventListener("click", () => {
      const num = parseInt(cell.textContent);
      if (num === current) {
        if (num === 1) {
          startTime = Date.now();
          timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            timerDisplay.textContent = `タイム: ${elapsed}秒`;
          }, 100);
        }

        cell.classList.add("clicked");
        current++;

        if (num === maxNum && startTime !== null) {
          clearInterval(timerInterval);
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          timerDisplay.textContent = `タイム: ${elapsed}秒`;
          message.textContent = "クリア！おめでとう！";

          // 🏆 難易度ごとのベスト記録保存
          const currentBest = localStorage.getItem(key);
          if (currentBest === null || elapsed < parseFloat(currentBest)) {
            localStorage.setItem(key, elapsed);
            bestTimeDisplay.textContent = `ベストタイム: ${elapsed}秒`;
          }

          restartBtn.style.display = "inline-block";
        }
      } else {
        message.textContent = `ミス！ ${current} を押してください`;
      }
    });

    board.appendChild(cell);
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  const gridSize = parseInt(document.getElementById("difficulty").value);
  createGame(gridSize);
});

document.getElementById("restartBtn").addEventListener("click", () => {
  const gridSize = parseInt(document.getElementById("difficulty").value);
  createGame(gridSize);
});

