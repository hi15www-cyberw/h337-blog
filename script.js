import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc } 
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnPp93cxNe9KE-5HM6IXoMAaSEoAJuTZ4",
  authDomain: "mybrand-blog.firebaseapp.com",
  projectId: "mybrand-blog",
  storageBucket: "mybrand-blog.firebasestorage.app",
  messagingSenderId: "395834373747",
  appId: "1:395834373747:web:5f076469021145104d1c06"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userText = document.getElementById("user");
const postInput = document.getElementById("postInput");
const addPostBtn = document.getElementById("addPost");
const postsDiv = document.getElementById("posts");

let currentUser = null;

// 🔐 ЛОГИН
loginBtn.onclick = () => signInWithPopup(auth, provider);

// 🔐 ВЫХОД
logoutBtn.onclick = () => signOut(auth);

// 🔐 ПРОВЕРКА ПОЛЬЗОВАТЕЛЯ
onAuthStateChanged(auth, user => {
  if(user){
    currentUser = user;
    userText.innerText = "Ты вошёл как: " + user.displayName;
  } else {
    userText.innerText = "Ты не вошёл";
  }
});

// 📝 ДОБАВИТЬ ПОСТ
addPostBtn.onclick = async () => {
  if(!currentUser) return alert("Сначала войди");

  await addDoc(collection(db, "posts"), {
    text: postInput.value,
    user: currentUser.displayName,
    likes: 0,
    createdAt: Date.now()
  });

  postInput.value = "";
};

// 📡 СЛУШАЕМ ПОСТЫ
onSnapshot(collection(db, "posts"), snapshot => {
  postsDiv.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <b>${data.user}</b>
      <p>${data.text}</p>
      <button>❤️ ${data.likes}</button>
    `;

    div.querySelector("button").onclick = async () => {
      await updateDoc(doc(db,"posts",docSnap.id), {
        likes: data.likes + 1
      });
    };

    postsDiv.appendChild(div);
  });
});
