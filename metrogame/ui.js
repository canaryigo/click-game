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

function checkGameEnd(svg) {
  const playerPos = gameState.player;
  const winTurn = 2; // 勝利条件のターン数

  if (gameState.oni.includes(playerPos)) {
    alert("ゲームオーバー！鬼につかまりました。");
    svg.querySelectorAll(".station").forEach(circle => {
      const newCircle = circle.cloneNode(true);
      circle.parentNode.replaceChild(newCircle, circle);
    });
  } else if (gameState.turn >= winTurn) {
    alert("勝利！鬼から逃げ切りました。");
    svg.querySelectorAll(".station").forEach(circle => {
      const newCircle = circle.cloneNode(true);
      circle.parentNode.replaceChild(newCircle, circle);
    });
  }
}

export function enableStationClicks(svg, onSelect) {
  Object.entries(stations).forEach(([id, station]) => {
    const circle = svg.querySelector(`#${id}`);
    const newCircle = circle.cloneNode(true);
    circle.parentNode.replaceChild(newCircle, circle);

    if (gameState.player && stations[gameState.player].neighbors.includes(id)) {
      newCircle.style.cursor = "pointer";
      newCircle.addEventListener("click", () => {
        onSelect(id);
        moveOniTowardPlayer();
        gameState.turn += 1;
        drawCharacters(svg);
        checkGameEnd(svg);
        enableStationClicks(svg, onSelect);
      }, { once: true });
      newCircle.setAttribute("fill", "#ccf");
    } else {
      newCircle.style.cursor = "default";
      newCircle.setAttribute("fill", "#fff");
    }
  });
}
