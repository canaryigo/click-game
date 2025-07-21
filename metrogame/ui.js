import { stations } from "./map.js";
import { gameState } from "./state.js";

export function drawCharacters(svg) {
  // プレイヤー（青）
  const p = stations[gameState.player];
  const pc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  pc.setAttribute("cx", p.x);
  pc.setAttribute("cy", p.y);
  pc.setAttribute("r", 8);
  pc.setAttribute("fill", "blue");
  svg.appendChild(pc);

  // 鬼（赤）
  for (const pos of gameState.oni) {
    const o = stations[pos];
    const oc = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    oc.setAttribute("cx", o.x);
    oc.setAttribute("cy", o.y);
    oc.setAttribute("r", 8);
    oc.setAttribute("fill", "red");
    svg.appendChild(oc);
  }
}