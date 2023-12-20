const scoresContainer = document.querySelector(".scores")
let scores = JSON.parse(scoresContainer.getAttribute("data-scores"))
scoresContainer.removeAttribute("data-scores")

function generateScoreCard(score, index) {
  return `<div class="score-card" data-index="${index}">
    <div class="sport-info">
      <img src="imgs/${score.sportIcon}">
      <h3>${score.date}</h3>
      <p>${score.sportName}</p>
    </div>
  
    <div class="school-info">
      <img src="imgs/${score.school1.img}">
      <p>${score.school1.score}</p>
      <h2>${score.school1.name}</h2>
    </div>
  
    <div class="school-info">
      <img src="imgs/${score.school2.img}">
      <p>${score.school2.score}</p>
      <h2>${score.school2.name}</h2>
    </div>
  </div>`
}

scoresContainer.innerHTML = generateScoreCard(scores[0], 0)
if (scores[1]) {
  scoresContainer.insertAdjacentHTML("beforeend", generateScoreCard(scores[1], 1))
} else {
  scoresContainer.insertAdjacentHTML("beforeend", generateScoreCard(scores[0], 0))
}

setInterval(() => {
  const current = parseInt(scoresContainer.children[1].getAttribute("data-index"))
  let next = current + 1
  if (!scores[next]) next = 0

  scoresContainer.style.animation = "move 1.5s ease-in-out forwards"
  const timeout = setTimeout(() => {
    scoresContainer.style.animation = ""
    scoresContainer.children[0].remove()
    scoresContainer.insertAdjacentHTML("beforeend", generateScoreCard(scores[next], next))
    clearTimeout(timeout)
  }, 1500)
}, 3000)

setInterval(async () => {
  const res = await fetch("/api/get-scores", {method: "POST"})
  const data = await res.json()
  scores = data.scores
}, (60 * 60 * 1000))