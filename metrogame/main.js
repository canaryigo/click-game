import { drawMap, loadStations } from "./map.js";
import { drawCharacters, enableStationClicks, resetGame } from "./ui.js";
import { gameState } from "./state.js";

window.addEventListener("DOMContentLoaded", async () => {
  const svg = document.getElementById("map");

  await loadStations();          // ← ここが重要！
  drawMap(svg);
  drawCharacters(svg);

  enableStationClicks(svg, id => {
    gameState.player = id;
  });

  const surrenderBtn = document.getElementById("surrender-button");
  if (surrenderBtn) {
    surrenderBtn.onclick = () => {
      resetGame(svg);
      document.getElementById("resign-button").style.display = "none";
    };
  }
});
