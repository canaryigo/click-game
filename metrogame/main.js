import { drawMap } from "./map.js";
import { drawCharacters, enableStationClicks } from "./ui.js";
import { gameState } from "./state.js";

window.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("map");
  drawMap(svg);
  drawCharacters(svg);

  enableStationClicks(svg, id => {
    gameState.player = id;
  });

  // 投了ボタンのクリック処理（svgが使えるスコープ）
  const surrenderBtn = document.getElementById("surrender-button");
  if (surrenderBtn) {
    surrenderBtn.onclick = () => {
      resetGame(svg);
      document.getElementById("resign-button").style.display = "none";
    };
  }
});
