const axios = require("axios")
const Keys = require("../Models/Keys")

async function getEvents() {
  const { key } = await Keys.findOne({_id: "659c0a5fd55feea809f1c460"})
  const res = await axios.get("https://graph.microsoft.com/v1.0/me/calendars/AAMkAGE4NzBkMTUzLTY2ZjEtNDA0ZS05NzZlLTZiMDI2Yjk0YWUxOABGAAAAAAAXlBkvp769TZGgsm_lxAtaBwDvMe1e-Kw_TJVDVSSeyrhQAAAAAAEHAAD2cOw24TbASJsIMgaYX8trAAVIVu9xAAA=/events", {
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  console.log(res.data)
}

getEvents()
module.exports = getEvents