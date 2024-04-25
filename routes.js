const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const userDb = require("./userDb");
const notesDb = require("./notesDb");
const bcrypt = require("./bcrypt.js");

//user routes
router.post("/user/signup", async (req, res) => {
  const { username, password } = req.body;
});
router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
});

//endpoints for notes
router.get("/notes", async (req, res) => {});

router.post("/notes/create", async (req, res) => {});

router.put("/notes/update", async (req, res) => {});

router.delete("/notes/delete", async (req, res) => {});

router.get("/notes/search", async (req, res) => {});

module.exports = { router };
