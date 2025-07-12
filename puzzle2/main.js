const board = document.getElementById("game-board");
const message = document.getElementById("message");

let numbers = [...Array(25).keys()].map(n => n + 1);
numbers.sort(() => Math.random() - 0.5); // ランダムシャッフル

let current = 1;

for (let i = 0; i < 25; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.textContent = numbers[i];
  cell.addEventListener("click", () => {
    const num = parseInt(cell.textContent);
    if (num === current) {
      cell.classList.add("clicked");
      current++;
      if (current > 25) {
        message.textContent = "クリア！おめでとう！";
      }
    } else {
      message.textContent = `ミス！ ${current} を押してください`;
    }
  });
  board.appendChild(cell);

let startTime = null;
    if (clickedNumber === 1) {
        startTime = Date.now(); // 現在のミリ秒
    }
    if (clickedNumber === 25 && startTime !== null) {
    const endTime = Date.now();
    const elapsed = ((endTime - startTime) / 1000).toFixed(2);
    document.getElementById("timer").textContent = `タイム: ${elapsed}秒`;
    }
}
