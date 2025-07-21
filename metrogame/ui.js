// ui.js
import { stations } from "./map.js";
import { gameState } from "./state.js";

export function drawCharacters(svg) {
  // 既存のキャラをクリア（重複防止）
  svg.querySelectorAll(".character").forEach(el => el.remove());

  // プレイヤー（青）
  const p = stations[gameState.player];
  const pc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  pc.setAttribute("cx", p.x);
  pc.setAttribute("cy", p.y);
  pc.setAttribute("r", 8);
  pc.setAttribute("fill", "blue");
  pc.classList.add("character");
  svg.appendChild(pc);

  // 鬼（赤）ずらして描画
  const groupedOni = {};
  for (const pos of gameState.oni) {
    if (!groupedOni[pos]) groupedOni[pos] = 0;
    groupedOni[pos]++;
  }

  for (const [pos, count] of Object.entries(groupedOni)) {
    const base = stations[pos];
    for (let i = 0; i < count; i++) {
      const offsetX = (i % 2) * 10 - 5;
      const offsetY = Math.floor(i / 2) * 10 - 5;
      const oc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      oc.setAttribute("cx", base.x + offsetX);
      oc.setAttribute("cy", base.y + offsetY);
      oc.setAttribute("r", 8);
      oc.setAttribute("fill", "red");
      oc.classList.add("character");
      svg.appendChild(oc);
    }
  }

  // ターン表示更新
  const turnDisplay = document.getElementById("turn-display");
  if (turnDisplay) {
    turnDisplay.textContent = `ターン: ${gameState.turn}`;
  }
}

function moveOniTowardPlayer() {
  const playerPos = gameState.player;

  gameState.oni = gameState.oni.map(current => {
    if (current === playerPos) return current;

    const visited = new Set();
    const queue = [[current]];
    visited.add(current);

    while (queue.length > 0) {
      const path = queue.shift();
      const last = path[path.length - 1];

      if (last === playerPos && path.length >= 2) {
        return path[1];
      }

      for (let neighbor of stations[last].neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return current;
  });
}

function resetGame(svg) {
  gameState.player = "otemachi";
  gameState.oni = ["kitasenju", "kitasenju", "meguro", "meguro"];
  gameState.turn = 1;
  drawCharacters(svg);
  enableStationClicks(svg, id => {
    gameState.player = id;
  });
}

function checkGameEnd(svg) {
  const playerPos = gameState.player;
  const winTurn = 4;

  if (gameState.oni.includes(playerPos)) {
    if (confirm("ゲームオーバー！鬼につかまりました。\nリプレイしますか？")) {
      resetGame(svg);
    }
    return true;
  } else if (gameState.turn >= winTurn) {
    if (confirm("勝利！鬼から逃げ切りました。\nリプレイしますか？")) {
      resetGame(svg);
    }
    return true;
  }
  return false;
}

export function enableStationClicks(svg, onSelect) {
  // 駅クリックの登録前に全て初期化
  Object.entries(stations).forEach(([id, station]) => {
    const circle = svg.querySelector(`#${id}`);
    const newCircle = circle.cloneNode(true);
    circle.parentNode.replaceChild(newCircle, circle);

    newCircle.style.cursor = "default";
    newCircle.setAttribute("fill", "#fff");
  });

  // 移動可能な隣接駅一覧
  const neighbors = stations[gameState.player].neighbors;

  if (neighbors.length > 0) {
    neighbors.forEach(id => {
      const circle = svg.querySelector(`#${id}`);
      if (!circle) return;

      circle.style.cursor = "pointer";
      circle.setAttribute("fill", "#ccf");
      circle.addEventListener("click", () => {
        onSelect(id);
        moveOniTowardPlayer();
        gameState.turn += 1;
        drawCharacters(svg);
        if (!checkGameEnd(svg)) {
          enableStationClicks(svg, onSelect);
        }
      }, { once: true });
    });
  } else {
    // 行き止まり時：その場に留まるクリックを許可
    const waitCircle = svg.querySelector(`#${gameState.player}`);
    waitCircle.style.cursor = "pointer";
    waitCircle.setAttribute("fill", "#ccf");
    waitCircle.addEventListener("click", () => {
    onSelect(gameState.player); // ← 追加
    moveOniTowardPlayer();
    gameState.turn += 1;
    drawCharacters(svg);
    if (!checkGameEnd(svg)) {
        enableStationClicks(svg, onSelect);
    }
    }, { once: true });
  }
}