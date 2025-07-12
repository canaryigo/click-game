const answer = Math.floor(Math.random() * 100) + 1;
const input = document.getElementById("guess");
const msg = document.getElementById("message");

document.getElementById("checkBtn").addEventListener("click", () => {
  const guess = Number(input.value);
  if (guess === answer) {
    msg.textContent = "正解！おめでとう🎉";
    msg.style.color = "green";
  } else if (guess < answer) {
    msg.textContent = "もっと大きいよ";
    msg.style.color = "blue";
  } else {
    msg.textContent = "もっと小さいよ";
    msg.style.color = "red";
  }
});
