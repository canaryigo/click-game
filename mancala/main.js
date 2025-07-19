const stoneSound = new Audio("sound/click.mp3");
const turnSound = new Audio("sound/turn.mp3");
turnSound.volume = 0.7;
const goalSound = new Audio("sound/goal.mp3");
goalSound.volume = 0.7;
const board = [4,4,4,4,4,4,0,4,4,4,4,4,4,0];
stoneSound.currentTime = 0;
stoneSound.play();

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
      //if (j === 0) {
    //stoneSound.currentTime = 0;
    //stoneSound.play();
  //}
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

  document.querySelectorAll('.pit').forEach(p => p.style.pointerEvents = "none"); // 操作ロック

  distributeStonesAnimated(index, stones, (lastIndex) => {
    // 再手番チェック
    if ((currentPlayer === 'A' && lastIndex === 6) || (currentPlayer === 'B' && lastIndex === 13)) {
      // 再手番
  } else {
    turnSound.currentTime = 0;
    turnSound.play();

    currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
    updateTurnDisplay();
  }

  checkGameEnd();
  document.querySelectorAll('.pit').forEach(p => p.style.pointerEvents = "auto");
});

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

function distributeStonesAnimated(startIndex, stones, callback) {
  let i = startIndex;

  const fromPit = document.querySelector(`[data-index='${startIndex}']`);
  const stonesInPit = Array.from(fromPit.querySelectorAll('.stone'));

  function dropNext() {
    if (stones > 0) {
      do {
        i = (i + 1) % 14;
      } while (
        (currentPlayer === 'A' && i === 13) ||
        (currentPlayer === 'B' && i === 6)
      );

      const toPit = document.querySelector(`[data-index='${i}']`);
      const toRect = toPit.getBoundingClientRect();

      // クリック元の石を1つ取得して飛ばす
      const stoneEl = stonesInPit.shift();
      const fromRect = stoneEl.getBoundingClientRect();

      const flyStone = stoneEl.cloneNode(true);
      flyStone.classList.add("flying-stone");

      // 最初の位置に配置
      flyStone.style.left = `${fromRect.left + fromRect.width / 2 - 8}px`;
      flyStone.style.top = `${fromRect.top + fromRect.height / 2 - 8}px`;

      // 石を削除し、bodyに飛び石追加
      stoneEl.remove();
      document.body.appendChild(flyStone);

      requestAnimationFrame(() => {
        flyStone.style.left = `${toRect.left + toRect.width / 2 - 8}px`;
        flyStone.style.top = `${toRect.top + toRect.height / 2 - 8}px`;
      });

      setTimeout(() => {
        board[i]++;

        // 仮の石を移動先に入れて見た目に反映
        const newStone = document.createElement("div");
        newStone.classList.add("stone");
        toPit.appendChild(newStone);

        flyStone.remove();

        const isOwnGoal =
          (currentPlayer === 'A' && i === 6) ||
          (currentPlayer === 'B' && i === 13);

        if (stones === 1 && isOwnGoal) {
          goalSound.currentTime = 0;
          goalSound.play();
        } else if (stones > 1 || !isOwnGoal) {
          stoneSound.currentTime = 0;
          stoneSound.play();
        }
        stones--;
        setTimeout(dropNext, 200);
      }, 300);
    } else {
      board[startIndex] = 0; // 全部飛ばし終わってから正式に0にする
      renderBoard();
      callback(i);
    }
  }

  dropNext();
}

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