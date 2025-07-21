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
    const options = stations[current].neighbors;
    if (options.includes(playerPos)) {
      return playerPos; // 直接隣ならすぐ行く
    }
    // プレイヤーに一番近づく駅を選ぶ（簡易）
    const next = options[0];
    return next || current;
  });
}

export function enableStationClicks(svg, onSelect) {
  // 全ての駅にイベントを登録（ただし合法手のみ）
  Object.entries(stations).forEach(([id, station]) => {
    const circle = svg.querySelector(`#${id}`);
    if (gameState.player && stations[gameState.player].neighbors.includes(id)) {
      circle.style.cursor = "pointer";
      circle.addEventListener("click", () => {
        onSelect(id);
        gameState.turn += 1;
        moveOniTowardPlayer();
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
