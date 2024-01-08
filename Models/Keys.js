const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  key: String
})
  
const Keys = mongoose.model("keys", schema)
module.exports = Keys