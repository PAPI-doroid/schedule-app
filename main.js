const root = document.getElementById("root");

if (root) {
  const message = document.createElement("h1");
  message.textContent = "スケジュールアプリ起動成功！";
  root.appendChild(message);
} else {
  console.error("root 要素が見つかりませんでした");
}

