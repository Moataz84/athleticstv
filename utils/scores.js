const axios = require("axios")
const { JSDOM } = require("jsdom")
const { URL } = require("url")
const path = require("path")
const fs = require("fs")

const url = "https://www.highschoolsportszone.ca/hwdsb/"

async function getDate() {
  const dates = []

  const formData = new FormData()
  formData.append("leagueid", "ALL")
  formData.append("dateSelect", "ALL")
  formData.append("schoolSelect", "6")
  formData.append("leagueSelect", "ALL")

  const res = await axios({
    method: "POST",
    url: `${url}viewScores.php`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })

  new JSDOM(res.data).window.document.querySelectorAll("#dateSelect option").forEach((element, index) => {
    if (index === 0) return
    const date = element.getAttribute("value")
    const offset = new Date().getTimezoneOffset() * 60000
    dates.push(new Date(new Date(date).getTime() + offset).getTime())
  })
  
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.toLocaleDateString("en-CA")
  const yesterday = dates.filter(date => d.getTime() > date).splice(-1)[0]
  const date = new Date(yesterday).toLocaleDateString("en-CA")
  return date
}

function findClosest(value, array) {
  let number = 0
  array.forEach(v => {
    if (value > v) number = v
  })
  return number
}

async function getScores() {
  const scores = []
  const regex = /[\n\r]+|[\s]{2,}/g
  const date =  await getDate()
  const sports = JSON.parse(fs.readFileSync(path.join(__dirname, "../sports.json"), "utf-8"))

  const formData = new FormData()
  formData.append("leagueid", "ALL")
  formData.append("dateSelect", date)
  formData.append("schoolSelect", "6")
  formData.append("leagueSelect", "ALL")

  const { data } = await axios({
    method: "POST",
    url: `${url}viewScores.php`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
 
  const document = new JSDOM(data).window.document
  const allRows = [...document.querySelectorAll("table tr")]
  const sportNameRows = [...document.querySelectorAll(`th[colspan="4"]`)]
  const sportNameRowsIndex = sportNameRows.map(th => allRows.indexOf(th.parentElement))
  
  const tds = [...document.querySelectorAll(`td[colspan="4"]`)]
  tds.forEach((td, i) => {
    if (i % 2 !== 0) return
    const tr = td.parentElement.previousElementSibling

    const rowIndex = allRows.indexOf(tr)
    const sportNameRow = allRows[findClosest(rowIndex, sportNameRowsIndex)]
    const sportId = new URL(`${url}${sportNameRow.children[0].children[0].href}`).searchParams.get("leagueid")
    const sportName = sportNameRow.textContent.replace(regex, " ").trim()
    const sportIcon = `sports/${sports.find(sport => sport.id === sportId).icon}`
    const scoreRow = tr.children
      
    const school1 = scoreRow[0]
    const school1Name = school1.textContent.replace(regex, " ").trim()
    const school1Img = `schools/${school1.children[0].children[0].src.replace("images/logos/", "")}`
    const score1 = scoreRow[1].textContent.replace(regex, " ").trim()

    const school2 = scoreRow[3]
    if (!school2) return
    const school2Name = school2.textContent.replace(regex, " ").trim()
    const school2Img = `schools/${school2.children[0].children[0].src.replace("images/logos/", "")}`
    console.log(school2Img)
    const score2 = scoreRow[2].textContent.replace(regex, " ").trim()

    scores.push({
      sportName,
      sportIcon,
      date: new Date(date).toLocaleDateString("en-CA", {day: "numeric", month: "long", year: "numeric"}),
      school1: {
        name: school1Name,
        img: school1Img,
        score: score1
      },
      school2: {
        name: school2Name,
        img: school2Img,
        score: score2
      }
    })
  })

  return scores
}

module.exports = getScores