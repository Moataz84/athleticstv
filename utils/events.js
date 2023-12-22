const puppeteer = require("puppeteer")
const fs = require("fs")

async function downloadFile() {
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()
  const client = await page.target().createCDPSession()

  await client.send("Page.setDownloadBehavior", {behavior: "allow", downloadPath: __dirname})
  await page.setContent("about:blank")
  await page.evaluate(() => {
    const link = document.createElement("a")
    link.href = "https://hwdsbonca-my.sharepoint.com/:x:/g/personal/crilett_hwdsb_on_ca/EWS3PoybviRKtr_mdZ6ZVdQBos62Kzo-NkUjFX46Ci2yVQ?download=1"
    link.click()
  })
  
  return new Promise(resolve => {
    fs.watchFile("./csvevents.csv", async () => {
      await browser.close()
      fs.unwatchFile("./csvevents.csv")
      resolve()
    })
  })
}

async function getEvents() {
  await downloadFile()
  const file = fs.readFileSync("./csvevents.csv", "utf-8")
  const rows = file.split("\n").filter((row, i) => i > 0).map(string => string.split(","))
  const events = rows.map(row => ({eventName: row[0], start: row[1], end: row[2]})).filter(e => e.start)
  return events
}

module.exports = getEvents