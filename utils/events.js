const axios = require("axios")
const Keys = require("../Models/Keys")

async function getEvents() {
  const d = new Date().getTime()
  const current = new Date(d).toISOString()
  const last = new Date(d + 604800000).toISOString()

  const { key } = await Keys.findOne({_id: "659c0a5fd55feea809f1c460"})
  const { data : { value }} = await axios.get(`https://graph.microsoft.com/v1.0/me/calendars/AAMkAGE4NzBkMTUzLTY2ZjEtNDA0ZS05NzZlLTZiMDI2Yjk0YWUxOABGAAAAAAAXlBkvp769TZGgsm_lxAtaBwDvMe1e-Kw_TJVDVSSeyrhQAAAAAAEHAAD2cOw24TbASJsIMgaYX8trAAVIVu9xAAA=/calendarView?StartDateTime=${current}&EndDateTime=${last}`, {
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  const events = value.map(event => ({subject: event.subject, start: event.start.dateTime, end: event.end.dateTime}))
  return events
}

module.exports = getEvents