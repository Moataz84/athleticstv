const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require("path")
const uuid = require("uuid")
const Posts = require("./Models/Posts")
const imagekit = require("./utils/imagekit")
const mainRoutes = require("./routes/main")
const apiRoutes = require("./routes/api")
const { checkLoggedIn } = require("./utils/middleware")

if (process.env.NODE_ENV !== "production") require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
  maxHttpBufferSize: 1e11
})

const port = 3000
const URI = process.env.DB_URI

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, 'views'))
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(express.json({limit: "100mb"}))
app.use(express.static(path.join(__dirname, "/public")))

app.use("/api", apiRoutes)
app.use("/", mainRoutes)

io.on("connection", socket => {

})

mongoose.connect(URI).then(() => server.listen(port, () => console.log(`http://localhost:${port}`)))