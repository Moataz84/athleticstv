const scoresSlider = document.querySelector(".scores")
let scores = JSON.parse(scoresSlider.getAttribute("data-scores"))
scoresSlider.removeAttribute("data-scores")

scoresSlider.innerHTML = `
<div class="score-card">
  <div class="sport-info">
    <img src="imgs/${scores[0].sportIcon}">
    <p>${scores[0].date}</p>
    <p>${scores[0].sportName}</p>
  </div>

  <div class="school1-info">
    <img src="${scores[0].school1.img}">
    <p>${scores[0].school1.score}</p>
    <p>${scores[0].school1.name}</p>
  </div>

  <div class="school2-info">
    <img src="${scores[0].school2.img}">
    <p>${scores[0].school2.score}</p>
    <p>${scores[0].school2.name}</p>
  </div>

</div>
`