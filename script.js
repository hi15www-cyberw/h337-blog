import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "ТВОЙ API KEY",
  authDomain: "ТВОЙ ДОМЕН",
  projectId: "ТВОЙ ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

let user = null;

// LOGIN
loginBtn.onclick = () => signInWithPopup(auth, provider);
logoutBtn.onclick = () => signOut(auth);

// USER STATE
onAuthStateChanged(auth, (u) => {
  user = u;
  userText.innerText = u ? "Ты вошёл: " + u.displayName : "Ты не вошёл";
  loadPosts();
});

// ADD POST
window.addPost = async () => {
  const text = postInput.value;
  if (!text || !user) return alert("Войди!");

  await addDoc(collection(db, "posts"), {
    text,
    likes: 0,
    author: user.displayName
  });

  postInput.value = "";
  loadPosts();
};

// LOAD POSTS
async function loadPosts() {
  posts.innerHTML = "";
  const snap = await getDocs(collection(db, "posts"));

  snap.forEach(docItem => {
    const data = docItem.data();

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <b>${data.author}</b><br>
      ${data.text}
      <br><span class="like" onclick="likePost('${docItem.id}', ${data.likes})">❤️ ${data.likes}</span>
    `;

    posts.appendChild(div);
  });
}

// LIKE
window.likePost = async (id, likes) => {
  const ref = doc(db, "posts", id);
  await updateDoc(ref, { likes: likes + 1 });
  loadPosts();
};

// TABS
window.showTips = () => {
  content.innerHTML = `
    <h3>🔥 10 советов</h3>
    <ul>
      <li>Учись каждый день</li>
      <li>Делай проекты</li>
      <li>Не бойся ошибок</li>
      <li>Пиши код сам</li>
      <li>Читай документацию</li>
      <li>Практика > теория</li>
      <li>Смотри разборы</li>
      <li>Используй GitHub</li>
      <li>Делай красиво</li>
      <li>Не сдавайся</li>
    </ul>
  `;
};

window.showHacks = () => {
  content.innerHTML = `
    <h3>⚡ 5 лайфхаков</h3>
    <ul>
      <li>Ctrl+C / Ctrl+V — быстрее работы 😎</li>
      <li>StackOverflow — твой друг</li>
      <li>ChatGPT — ускоряет x10</li>
      <li>Темная тема = комфорт</li>
      <li>Маленькие шаги каждый день</li>
    </ul>
  `;
};
