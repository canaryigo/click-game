export const stations = {
  otemachi:    { name: "大手町", x: 300, y: 200, neighbors: ["tokyo", "kanda", "shinjuku"] },
  tokyo:       { name: "東京", x: 400, y: 200, neighbors: ["otemachi", "yurakucho"] },
  yurakucho:   { name: "有楽町", x: 500, y: 200, neighbors: ["tokyo", "shimbashi"] },
  shimbashi:   { name: "新橋", x: 600, y: 200, neighbors: ["yurakucho", "shinagawa"] },
  shinagawa:   { name: "品川", x: 700, y: 250, neighbors: ["shimbashi"] },

  kanda:       { name: "神田", x: 300, y: 100, neighbors: ["otemachi", "akihabara"] },
  akihabara:   { name: "秋葉原", x: 400, y: 100, neighbors: ["kanda", "ueno"] },
  ueno:        { name: "上野", x: 500, y: 100, neighbors: ["akihabara", "ikebukuro"] },
  ikebukuro:   { name: "池袋", x: 600, y: 100, neighbors: ["ueno"] },

  shinjuku:    { name: "新宿", x: 200, y: 250, neighbors: ["otemachi"] }
};

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
