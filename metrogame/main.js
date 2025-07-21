import { drawMap } from './map.js';
import { drawCharacters } from './ui.js';

window.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("map");
  drawMap(svg);         // 駅と線を描画
  drawCharacters(svg);  // プレイヤーと鬼を描画
});
