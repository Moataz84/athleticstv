const scoresContainer = document.querySelector(".scores")
let scores = JSON.parse(scoresContainer.getAttribute("data-scores"))
scoresContainer.removeAttribute("data-scores")

function generateScoreCard(score, total, index) {
  let spans = ""
  for (let i = 0; i < total; i++) {
    if (i === index) {
      spans += `<span class="current"></span>`
    } else {
      spans += "<span></span>"
    }
  }

  return `<div class="score-card">
    <div class="sport-info">
      <img src="imgs/${score.sportIcon}">
      <h3>${score.date}</h3>
      <p>${score.sportName}</p>
    </div>
  
    <div class="school-info">
      <img src="${score.school1.img}">
      <p>${score.school1.score}</p>
      <h2>${score.school1.name}</h2>
    </div>
  
    <div class="school-info">
      <img src="${score.school2.img}">
      <p>${score.school2.score}</p>
      <h2>${score.school2.name}</h2>
    </div>
  
    <div class="card-list">${spans}</div>
  </div>`
}

scoresContainer.innerHTML = generateScoreCard(scores[0], scores.length, 0)