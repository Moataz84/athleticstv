const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")
const Posts = require("../Models/Posts")
const { validateJWT, checkLoggedIn } = require("../utils/middleware")

router.get("/", validateJWT, (req, res) => {
	res.render("create-post", {loggedIn: checkLoggedIn(req)})
})

router.get("/login", validateJWT, (req, res) => {
	res.render("login", {loggedIn: checkLoggedIn(req)})
})

module.exports = router