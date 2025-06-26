import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdX0q9pyWsvsXzSS3nj7Rivz420tEpxU",
  authDomain: "schedule-app-faf39.firebaseapp.com",
  databaseURL: "https://schedule-app-faf39-default-rtdb.firebaseio.com",
  projectId: "schedule-app-faf39",
  storageBucket: "schedule-app-faf39.appspot.com",
  messagingSenderId: "56363342875",
  appId: "1:56363342875:web:585c9a21f9874a58785e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let selectedBase = "本社";
let currentYear = 2025;
let currentMonth = 6;
let sites = [];

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("hidden");
});

document.getElementById("menu-schedule").addEventListener("click", () => {
  renderSchedule();
  document.getElementById("menu").classList.add("hidden");
});

document.getElementById("menu-site").addEventListener("click", () => {
  renderSiteRegister();
  document.getElementById("menu").classList.add("hidden");
});

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getWeekday(year, month, day) {
  return new Date(year, month - 1, day).toLocaleDateString("ja-JP", { weekday: "short" });
}

function renderSchedule() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div>
      拠点：<select id="base-select">
        <option value="本社" ${selectedBase === "本社" ? "selected" : ""}>本社</option>
        <option value="横浜" ${selectedBase === "横浜" ? "selected" : ""}>横浜</option>
      </select>
      <button id="prev-month">前月</button>
      ${currentYear}年${currentMonth}月
      <button id="next-month">翌月</button>
    </div>
    <div style="overflow: auto; max-height: 80vh;">
      <table id="schedule-table"></table>
    </div>
  `;

  document.getElementById("base-select").addEventListener("change", (e) => {
    selectedBase = e.target.value;
    renderSchedule();
  });

  document.getElementById("prev-month").addEventListener("click", () => {
    if (currentMonth === 1) {
      currentMonth = 12;
      currentYear--;
    } else {
      currentMonth--;
    }
    renderSchedule();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    if (currentMonth === 12) {
      currentMonth = 1;
      currentYear++;
    } else {
      currentMonth++;
    }
    renderSchedule();
  });

  const table = document.getElementById("schedule-table");

  let headerRow = "<tr><th class='fixed fixed-top-left'></th>";
  const days = getDaysInMonth(currentYear, currentMonth);
  for (let d = 1; d <= days; d++) {
    const weekday = getWeekday(currentYear, currentMonth, d);
    const color = weekday === "日" ? "red" : weekday === "土" ? "blue" : "black";
    headerRow += `<th class='fixed fixed-top' style='color:${color}'>${d}日(${weekday})</th>`;
  }
  headerRow += "</tr>";

  let secondRow = `<tr><th class='fixed fixed-left'>空き状況</th>`;
  for (let d = 1; d <= days; d++) {
    secondRow += `<td></td>`;
  }
  secondRow += "</tr>";

  let siteRows = "";
  sites.forEach(site => {
    if (site.base === selectedBase) {
      let row = `<tr><th class='fixed fixed-left'>${site.name}</th>`;
      for (let d = 1; d <= days; d++) {
        const cellDate = `${currentYear}-${currentMonth}-${d}`;
        if (new Date(cellDate) < new Date(site.start) || new Date(cellDate) > new Date(site.end)) {
          row += `<td style='background: #ccc;'></td>`;
        } else {
          row += `<td></td>`;
        }
      }
      row += "</tr>";
      siteRows += row;
    }
  });

  table.innerHTML = headerRow + secondRow + siteRows;
}

function renderSiteRegister() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div>
      <h2>現場登録</h2>
      <div>現場名：<input id="site-name" type="text" /></div>
      <div>拠点：
        <select id="site-base">
          <option value="本社">本社</option>
          <option value="横浜">横浜</option>
        </select>
      </div>
      <div>工期開始：<input id="site-start" type="date" /></div>
      <div>工期終了：<input id="site-end" type="date" /></div>
      <button id="register-site">登録</button>
    </div>
  `;

  document.getElementById("register-site").addEventListener("click", () => {
    const name = document.getElementById("site-name").value.trim();
    const base = document.getElementById("site-base").value;
    const start = document.getElementById("site-start").value;
    const end = document.getElementById("site-end").value;

    if (!name || !start || !end) {
      alert("全て入力してください");
      return;
    }

    const newSite = { name, base, start, end };
    push(ref(db, "sites"), newSite);
    alert("現場登録完了");
    renderSiteRegister();
  });
}

onValue(ref(db, "sites"), (snapshot) => {
  const data = snapshot.val();
  sites = [];
  for (let key in data) {
    sites.push(data[key]);
  }
  renderSchedule();
});

// 初期表示
renderSchedule();
