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
  const [posts, scores, events] = await Promise.all([
    Posts.find({approved: true, $or: [{createdAt: {$gt: (new Date().getTime() - 604800000)}}, {expire: false}]}),
    getScores(), 
    getEvents()
  ])
  res.render("view", {scores: JSON.stringify(scores), posts: JSON.stringify(posts), events})
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