const { Router } = require("express");
const router = Router();
const jwt = require("./jwt.js");
const db = require("./db.js");
const bcrypt = require("./bcrypt.js");

//user routes
//creates account
router.post("/user/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userNameTaken = await db.findUser(username);
    if (userNameTaken) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hashPassword(password);
    const newUser = await db.addUser(username, hashedPassword);
    res.status(200).json({
      sucess: true,
      message: "new user added",
    });
  } catch (error) {
    res.status(500).json({ error: "internal server problems" });
  }
});

//login account
router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    //check if user exists
    const user = await db.findUser(username);
    if (!user) {
      res.status(404).json({ message: "User don't exists" });
      return;
    }
    //check if password is correct, if not correct password message will be sent
    const correctPassword = await bcrypt.comparePassword(
      password,
      user.password
    );
    if (!correctPassword) {
      res.status(404).json({ message: "Wrong password" });
      return;
    }
    const token = jwt.createToken(user._id);
    res
      .status(200)
      .json({ sucess: true, message: "sucessfully logged in", token: token });
  } catch (error) {
    res.status(500).json({ error: "internal server problems" });
  }
});

//endpoints for notes
router.get("/notes", async (req, res) => {
  try {
    const notes = db.findAllNotes();
    res.status(200).json({ sucess: true, message: notes });
  } catch (error) {
    res.status(500).json({ error: "internal server problems" });
  }
});

router.post("/notes/create", async (req, res) => {
  const headerToken = req.headers.authorization;
  const token = headerToken.replace("Bearer ", "");
  const { title, text } = req.body;
  const newNote = { title, text };
  try {
    const tokenData = jwt.isTokenValid(token);
    console.log(tokenData);
    if (tokenData) {
      console.log(newNote);
      if (!title || !text) {
        res
          .status(418)
          .json({ error: "both title and text are required, try again" });
        return;
      }
      //create dates & adds userId to the note
      const createdAt = new Date();
      const modifiedAt = createdAt;
      newNote.createdAt = createdAt;
      newNote.modifiedAt = modifiedAt;
      newNote.userId = tokenData.id;
      console.log(createdAt);

      //adds note to notes.db
      const addedNote = await db.addNote(newNote);
      res.status(200).json({ success: true, message: newNote });
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
});

router.put("/notes/update", async (req, res) => {
  const { id, title, text } = req.body;
  const newNoteInfo = { id, title, text };
  const headerToken = req.headers.authorization;
  const token = headerToken.replace("Bearer ", "");
  try {
    const tokenData = jwt.isTokenValid(token);
    if (tokenData) {
      const updatedNote = await db.updateNote(newNoteInfo);
      res
        .status(200)
        .json({ success: true, message: "note have been updated!" });
    }
  } catch {
    res.status(500).json({ error: "internal server problems" });
  }
});

router.delete("/notes/delete", async (req, res) => {
  const { _id } = req.body;
  const headerToken = req.headers.authorization;
  const token = headerToken.replace("Bearer ", "");
  const noteId = { _id };

  try {
    const tokenData = jwt.isTokenValid(token);
    if (tokenData) {
      const foundedNote = await db.searchNote(noteId);
      if (!foundedNote) {
        res.status(404).json({ message: "note could not be found" });
        return;
      }
      await db.deleteNote(foundedNote);
      res
        .status(200)
        .json({ sucess: true, message: "Your note have been deleted!" });
    }
  } catch {
    res.status(500).json({ error: "internal server problems" });
  }
});

router.get("/notes/search", async (req, res) => {
  const { title } = req.query;
  const noteTitle = { title };
  const headerToken = req.headers.authorization;
  const token = headerToken.replace("Bearer ", "");
  console.log(noteTitle);
  try {
    const tokenData = jwt.isTokenValid(token);
    if (tokenData) {
      const foundedNote = await db.searchNote(noteTitle);
      console.log(foundedNote);
      if (!foundedNote) {
        res.status(404).json({ message: "no note could be found" });
        return;
      }
      res.status(200).json({ success: true, message: foundedNote });
    }
  } catch {
    res.status(500).json({ error: "internal server problems" });
  }
});

module.exports = { router };
