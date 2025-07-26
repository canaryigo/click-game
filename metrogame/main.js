import { drawMap, loadStations } from "./map.js";
import { drawCharacters, enableStationClicks, resetGame } from "./ui.js";
import { gameState } from "./state.js";

window.addEventListener("DOMContentLoaded", async () => {
  const svg = document.getElementById("map");
  const debug = document.getElementById("debug-coords");

  await loadStations();
  drawMap(svg);
  drawCharacters(svg);
  enableStationClicks(svg, id => {
    gameState.player = id;
  });

  // 🐛 マウス座標表示（デバッグ）
  svg.addEventListener("mousemove", e => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    debug.textContent = `x: ${Math.round(cursorpt.x)}, y: ${Math.round(cursorpt.y)}`;
  });
});
  
  const surrenderBtn = document.getElementById("surrender-button");
  if (surrenderBtn) {
    surrenderBtn.onclick = () => {
      resetGame(svg);
      document.getElementById("resign-button").style.display = "none";
    };
  };
