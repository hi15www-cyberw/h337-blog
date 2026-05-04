const list = document.getElementById("list");
const postsContainer = document.getElementById("posts");
const search = document.getElementById("search");

// 🌗 тема
const toggle = document.getElementById("themeToggle");
let theme = localStorage.getItem("theme") || "dark";
document.body.className = theme;

toggle.onclick = () => {
  theme = theme === "dark" ? "light" : "dark";
  document.body.className = theme;
  localStorage.setItem("theme", theme);
};

// 📚 загрузка списка постов
let postsData = [];

fetch("posts.json")
  .then(r => r.json())
  .then(data => {
    postsData = data;
    renderList(data);
  });

// вывод списка
function renderList(data){
  list.innerHTML = "";
  data.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-link";
    div.textContent = post.title;

    div.onclick = () => loadPost(post.file);

    list.appendChild(div);
  });
}

// загрузка поста
function loadPost(file){
  fetch("posts/" + file)
    .then(r => r.text())
    .then(md => {
      const html = marked.parse(md);

      const div = document.createElement("div");
      div.className = "post";

      const template = document.createElement("template");
      template.innerHTML = html;

      div.appendChild(template.content);

      postsContainer.innerHTML = "";
      postsContainer.appendChild(div);
    });
}

// 🔍 поиск
search.oninput = () => {
  const q = search.value.toLowerCase();
  const filtered = postsData.filter(p =>
    p.title.toLowerCase().includes(q)
  );
  renderList(filtered);
};
