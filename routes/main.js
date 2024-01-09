const express = require("express")
const router = express.Router()
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")
const getScores = require("../utils/scores")
const getEvents = require("../utils/events")

router.get("/", validateJWT, (req, res) => {
	res.render("create-post", {loggedIn: checkLoggedIn(req)})
})

router.get("/view", validateJWT, async (req, res) => {
  const [scores, events] = await Promise.all([getScores(), getEvents()])
  console.log(events)
  res.render("view", {scores: JSON.stringify(scores), events})
})

router.get("/login", validateJWT, (req, res) => {
	res.render("login", {loggedIn: checkLoggedIn(req)})
})

router.get("/dashboard", validateJWT, async (req, res) => {
	const data = await Posts.find({$or: [{createdAt: {$gt: (new Date().getTime() - 604800000)}}, {expire: false}]})
	const posts = data.map(post => ({
		...post._doc,
		createdAt: new Date(new Date(post._doc.createdAt).getTime() + 604800000).getTime()
	}))
	res.render("dashboard", {loggedIn: checkLoggedIn(req), posts})
})

router.get("/settings", validateJWT, (req, res) => {
	res.render("settings", {loggedIn: checkLoggedIn(req)})
})

module.exports = router