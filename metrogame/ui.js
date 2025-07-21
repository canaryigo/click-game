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

  // 鬼（赤）
  for (const pos of gameState.oni) {
    const o = stations[pos];
    const oc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    oc.setAttribute("cx", o.x);
    oc.setAttribute("cy", o.y);
    oc.setAttribute("r", 8);
    oc.setAttribute("fill", "red");
    oc.classList.add("character");
    svg.appendChild(oc);
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
      const path = queue.shift(); // 現在の経路（配列）
      const last = path[path.length - 1];

      if (last === playerPos && path.length >= 2) {
        return path[1]; // 最初の一歩だけ進む
      }

      for (let neighbor of stations[last].neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return current; // 動けない場合はstay
  });
}

export function enableStationClicks(svg, onSelect) {
  Object.entries(stations).forEach(([id, station]) => {
    const circle = svg.querySelector(`#${id}`);
    if (gameState.player && stations[gameState.player].neighbors.includes(id)) {
      circle.style.cursor = "pointer";
      circle.addEventListener("click", () => {
        onSelect(id); // プレイヤーを移動
        moveOniTowardPlayer(); // 鬼をまとめて1歩ずつ移動
        gameState.turn += 1; // ← 最後にターンを進める！
        drawCharacters(svg);
        enableStationClicks(svg, onSelect);
      }, { once: true });
      circle.setAttribute("fill", "#ccf");
    } else {
      circle.style.cursor = "default";
      circle.setAttribute("fill", "#fff");
    }
  });
}

circle.addEventListener("click", () => {
  onSelect(id);              // プレイヤー移動
  moveOniTowardPlayer();     // 鬼移動
  gameState.turn += 1;       // ←ここだけでカウント
  drawCharacters(svg);
  enableStationClicks(svg, onSelect); // 次のターン受付
}, { once: true });
