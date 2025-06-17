const daysInMonth = 31;
const sites = [
  "現場K1", "現場L1", "現場M1", "現場N1",
  "現場O1", "現場P1", "現場Q1", "現場R1", "現場S1"
];

const dateRow = document.getElementById("date-row");
const siteColumn = document.getElementById("site-column");
const gridBody = document.getElementById("grid-body");

for (let d = 1; d <= daysInMonth; d++) {
  const cell = document.createElement("div");
  cell.className = "cell header";
  cell.textContent = `${d}日`;
  dateRow.appendChild(cell);
}

sites.forEach(site => {
  const label = document.createElement("div");
  label.className = "cell site";
  label.textContent = site;
  siteColumn.appendChild(label);

  const row = document.createElement("div");
  row.className = "row";
  for (let i = 0; i < daysInMonth; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    row.appendChild(cell);
  }
  gridBody.appendChild(row);
});
