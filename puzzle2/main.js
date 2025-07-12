const board = document.getElementById("game-board");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");

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

    if (num === 25 && startTime !== null) {
      const endTime = Date.now();
      const elapsed = ((endTime - startTime) / 1000).toFixed(2);
      message.textContent = "クリア！おめでとう！";

      // 最後のタイムを表示
      timerDisplay.textContent = `タイム: ${elapsed}秒`;

      // タイマーを止める
      clearInterval(timerInterval);
    }
  } else {
    message.textContent = `ミス！ ${current} を押してください`;
  }
  });

  board.appendChild(cell);
}
