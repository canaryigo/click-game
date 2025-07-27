import mapData from './grid_map_kanagawa.json' assert { type: 'json' };

const svg = document.getElementById('map');
const cellSize = 30;

// 市町村ごとの色
const cityColors = {};
let colorIndex = 0;
const colorPalette = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99', '#ffff99', '#cc99ff', '#ffb3e6'];

mapData.forEach(({ x, y, city }) => {
  // 市町村に色を割り当てる
  if (!cityColors[city]) {
    cityColors[city] = colorPalette[colorIndex % colorPalette.length];
    colorIndex++;
  }

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x * cellSize);
  rect.setAttribute('y', y * cellSize);
  rect.setAttribute('width', cellSize);
  rect.setAttribute('height', cellSize);
  rect.setAttribute('fill', cityColors[city]);
  rect.setAttribute('stroke', '#333');
  rect.setAttribute('stroke-width', '1');

  // ツールチップ表示用
  rect.addEventListener('mouseenter', () => {
    const tooltip = document.getElementById('tile-tooltip');
    tooltip.innerText = `${city} (${x}, ${y})`;
    tooltip.style.display = 'block';
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${x * cellSize + 10}px`;
    tooltip.style.top = `${y * cellSize + 10}px`;
  });
  rect.addEventListener('mouseleave', () => {
    document.getElementById('station-tooltip').style.display = 'none';
  });

  svg.appendChild(rect);
});
