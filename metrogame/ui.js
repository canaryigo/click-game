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
    if (current === playerPos) return current; // すでに同じ駅

    const visited = new Set();
    const queue = [[current, null]]; // [現在駅, 来た方向]

    let pathMap = {};
    visited.add(current);

    while (queue.length > 0) {
      const [stationId, from] = queue.shift();
      const neighbors = stations[stationId].neighbors;

      for (let neighbor of neighbors) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        pathMap[neighbor] = stationId; // どこから来たか記録

        if (neighbor === playerPos) {
          // ゴールに到達したら、逆順にたどって最初の1歩を取得
          let step = neighbor;
          while (pathMap[step] !== current) {
            step = pathMap[step];
          }
          return step;
        }
        queue.push([neighbor, stationId]);
      }
    }

    // ゴールに辿り着けない場合（あり得ない） → stay
    return current;
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
