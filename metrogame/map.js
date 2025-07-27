export let stations = {};

// JSONファイルから駅データを読み込む
export async function loadStations() {
  const response = await fetch("stations_checked.json");
  stations = await response.json();
}

export function drawMap(svg) {
  const lineColors = {
    "山手線": "#77c94e",
    "銀座線": "#f39800",
  };

  // 路線描画
  Object.entries(stations).forEach(([id, station]) => {
    station.neighbors.forEach(nid => {
      const neighbor = stations[nid];
      if (!neighbor) return;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", station.x);
      line.setAttribute("y1", station.y);
      line.setAttribute("x2", neighbor.x);
      line.setAttribute("y2", neighbor.y);
      const commonLines = station.lines?.filter(line => neighbor.lines?.includes(line));
      const color = commonLines?.length > 0 ? (lineColors[commonLines[0]] || "#aaa") : "#aaa";

      line.setAttribute("stroke", "#aaa");
      line.setAttribute("stroke-width", 4);
      svg.appendChild(line);
    });
  });

  // 駅（丸）描画
  Object.entries(stations).forEach(([id, station]) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", station.x);
    circle.setAttribute("cy", station.y);
    circle.setAttribute("r", 12);
    circle.setAttribute("fill", "#fff");
    circle.setAttribute("stroke", "#333");
    circle.setAttribute("stroke-width", 2);
    circle.setAttribute("id", id);
    circle.classList.add("station");

    // ★ ツールチップ表示用のイベント
    circle.addEventListener("mouseenter", e => {
      const tooltip = document.getElementById("station-tooltip");
      tooltip.textContent = station.name;
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
      tooltip.style.display = "block";
    });

    circle.addEventListener("mousemove", e => {
      const tooltip = document.getElementById("station-tooltip");
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    });

    circle.addEventListener("mouseleave", () => {
      const tooltip = document.getElementById("station-tooltip");
      tooltip.style.display = "none";
    });

    svg.appendChild(circle);
  });
}
