import { drawMap } from './map.js';
import { drawCharacters, enableStationClicks } from './ui.js';
import { gameState } from './state.js';

window.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("map");
  drawMap(svg);
  drawCharacters(svg);

  enableStationClicks(svg, (selectedId) => {
    gameState.player = selectedId;
    drawCharacters(svg);
    enableStationClicks(svg, () => {}); // 再度隣接駅のみを有効化
  });
});
