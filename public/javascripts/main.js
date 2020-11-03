const ulPosts = document.querySelector("#posts");
const divErr = document.querySelector("#err");

function populatePosts(posts) {
  for (const p of posts) {
    const liP = document.createElement("li");
    liP.innerHTML = `By: ${p.author} <br/> ${p.text}`;
    ulPosts.appendChild(liP);
  }
}

fetch("/posts")
  .then((res) => res.json())
  .then(populatePosts)
  .catch((err) => {
    divErr.textContent = err.message;
    divErr.style.display = "block";
  });
