export let stations = {};

export async function loadStations() {
  const response = await fetch("stations.json");
  stations = await response.json();
}

export function drawMap(svg) {
  // 路線（線）
  Object.entries(stations).forEach(([id, station]) => {
    station.neighbors.forEach(nid => {
      const neighbor = stations[nid];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", station.x);
      line.setAttribute("y1", station.y);
      line.setAttribute("x2", neighbor.x);
      line.setAttribute("y2", neighbor.y);
      line.setAttribute("stroke", "#aaa");
      line.setAttribute("stroke-width", 4);
      svg.appendChild(line);
    });
  });

  // 駅（ノード）
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
    svg.appendChild(circle);
  });
}
