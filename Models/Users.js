const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  username: String,
  password: String
})
  
const Users = mongoose.model("users", schema)
module.exports = Users