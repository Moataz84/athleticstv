const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const Posts = require("../Models/Posts")
const getScores = require("../utils/scores")
const getEvents = require("../utils/events")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")

router.get("/", validateJWT, (req, res) => {
	res.render("create-post", {loggedIn: checkLoggedIn(req)})
})

router.get("/login", validateJWT, (req, res) => {
	res.render("login", {loggedIn: checkLoggedIn(req)})
})

router.get("/view", validateJWT, async (req, res) => {
  const [scores, events] = await Promise.all([getScores(), getEvents()])
  res.render("view", {scores: JSON.stringify(scores), events: []})
})

module.exports = router