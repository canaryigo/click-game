const board = [4,4,4,4,4,4,0,4,4,4,4,4,4,0];
let currentPlayer = 'A';

function renderBoard() {
  document.querySelectorAll('.pit, .store').forEach(pit => {
    const i = parseInt(pit.dataset.index);
    const count = board[i];

    pit.innerHTML = ''; // 中身をクリア

    for (let j = 0; j < count; j++) {
      const stone = document.createElement("div");
      stone.classList.add("stone");

      // 石が多い場合は小さくする
      if (count >= 13) {
        stone.classList.add("tiny");
      } else if (count >= 9) {
        stone.classList.add("small");
      }

      pit.appendChild(stone);
    }
  });
}

function updateTurnDisplay() {
  const indicator = document.getElementById("turn-indicator");

  if (currentPlayer === 'A') {
    indicator.textContent = 'プレイヤーAの番です';
    indicator.classList.remove('b-turn');
    indicator.classList.add('a-turn');
  } else {
    indicator.textContent = 'プレイヤーBの番です';
    indicator.classList.remove('a-turn');
    indicator.classList.add('b-turn');
  }
}

document.querySelectorAll('.pit').forEach(pit => {
  pit.addEventListener('click', () => {
    const index = parseInt(pit.dataset.index);

    // 手番とマスのチェック
    if (currentPlayer === 'A' && index > 5) return;
    if (currentPlayer === 'B' && (index < 7 || index > 12)) return;

    pit.classList.add("clicked");               // ← ここで一時的にクラス追加
    setTimeout(() => {
      pit.classList.remove("clicked");          // ← 0.3秒後にクラス削除
    }, 100);

    let stones = board[index];
    if (stones === 0) return;

    board[index] = 0;
    let i = index;

    while (stones > 0) {
      i = (i + 1) % 14;

      // 相手のゴールをスキップ
      if (currentPlayer === 'A' && i === 13) continue;
      if (currentPlayer === 'B' && i === 6) continue;

      board[i]++;
      stones--;
    }

    renderBoard();

    // 最後の石が自分のゴールなら再手番
    if ((currentPlayer === 'A' && i === 6) || (currentPlayer === 'B' && i === 13)) {
      // 再手番
    } else {
      currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
      updateTurnDisplay();
    }

    checkGameEnd();
  });
});

const restartBtn = document.getElementById("restartBtn");

function resetGame() {
  board.length = 0; // boardを空にする
  board.push(4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0); // 初期値再設定
  currentPlayer = 'A';
  renderBoard();
  restartBtn.style.display = "none";
  document.querySelectorAll('.pit').forEach(p => {
    p.style.pointerEvents = "auto";
  updateTurnDisplay();
  });
}

restartBtn.addEventListener("click", resetGame);

function checkGameEnd() {
  const sideAEmpty = board.slice(0, 6).every(val => val === 0);
  const sideBEmpty = board.slice(7, 13).every(val => val === 0);

  if (sideAEmpty || sideBEmpty) {
    // 残りの石をゴールに加える
    if (!sideAEmpty) {
      for (let i = 0; i <= 5; i++) {
        board[6] += board[i];
        board[i] = 0;
      }
    }
    if (!sideBEmpty) {
      for (let i = 7; i <= 12; i++) {
        board[13] += board[i];
        board[i] = 0;
      }
    }

    renderBoard();

    // 勝敗判定
    const scoreA = board[6];
    const scoreB = board[13];
    let result = '';

    if (scoreA > scoreB) {
      result = 'プレイヤーAの勝ち！';
    } else if (scoreB > scoreA) {
      result = 'プレイヤーBの勝ち！';
    } else {
      result = '引き分け！';
    }

    setTimeout(() => {
      alert(`ゲーム終了！\nA: ${scoreA} / B: ${scoreB}\n${result}`);
    }, 200);
    
    // クリックを無効にする（イベント解除も検討）
    document.querySelectorAll('.pit').forEach(p => p.style.pointerEvents = "none");
    restartBtn.style.display = "inline-block";
  }
}
renderBoard();
