const { Router } = require("express");
const router = Router();
const jwt = require("./jwt.js");
const db = require("./db.js");
const bcrypt = require("./bcrypt.js");
const createDate = require("./createDate.js");
const { v4: uuidv4 } = require("uuid");
//user routes
//creates account
router.post("/user/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res
        .status(418)
        .json({ error: "both username and password are required, try again" });
      return;
    }
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
  const token = req.headers.authorization;

  try {
    const tokenData = jwt.isTokenValid(token);
    if (tokenData) {
      try {
        const foundedNotes = await db.findAllNotes();
        res.status(200).json({ sucess: true, message: foundedNotes });
      } catch (error) {
        res.status(500).json({ error: "internal server problems" });
      }
    }
    // const notes = db.findAllNotes();
  } catch (error) {
    res.status(400).json({ error: "invalid token" });
  }
});

//add note
router.post("/notes", async (req, res) => {
  const token = req.headers.authorization;
  const { title, text } = req.body;
  const newNote = { title, text };
  try {
    const tokenData = jwt.isTokenValid(token);
    console.log(tokenData);
    if (tokenData) {
      try {
        if (!title || !text) {
          res
            .status(418)
            .json({ error: "both title and text are required, try again" });
          return;
        }
        //create date & adds userId to the note
        const createdAt = createDate.createDate();
        const modifiedAt = createDate.createDate();
        newNote.createdAt = createdAt;
        newNote.modifiedAt = modifiedAt;
        newNote.userId = tokenData.id;
        newNote.id = uuidv4();
        console.log(createdAt);

        //adds note to notes.db
        const addedNote = await db.addNote(newNote);
        res.status(200).json({ success: true, message: newNote });
      } catch (error) {
        res.status(500).json({ error: "internal server problems" });
      }
      console.log(newNote);
    }
  } catch (error) {
    res.status(400).json({ error: "invalid token" });
    return;
  }
});
//update note with note._id, title and text from req.body
router.put("/notes", async (req, res) => {
  const { _id, title, text } = req.body;
  const newNoteInfo = { _id, title, text };
  const token = req.headers.authorization;
  try {
    const tokenData = jwt.isTokenValid(token);
    //if token i valid we search for note and sends the founded note toghether with the new info.
    if (tokenData) {
      try {
        if (!title || !text) {
          res
            .status(418)
            .json({ error: "both title and text are required, try again" });
          return;
        }
        const foundedNote = await db.searchNote(newNoteInfo);
        if (!foundedNote) {
          res.status(404).json({ message: "No note found with given id" });
          return;
        }

        //if everything is correct with token, title, text we updates the db with the new note info
        const updatedNote = await db.updateNote(foundedNote, newNoteInfo);
        res
          .status(200)
          .json({ success: true, message: "note have been updated!" });
      } catch (error) {
        res.status(500).json({ error: "internal server problems" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "invalid token" });
  }
});

router.delete("/notes", async (req, res) => {
  const { _id } = req.body;
  const token = req.headers.authorization;
  const noteId = { _id };
  try {
    const tokenData = jwt.isTokenValid(token);
    if (tokenData) {
      try {
        const foundedNote = await db.searchNote(noteId);
        if (!foundedNote) {
          res.status(404).json({ message: "note could not be found" });
          return;
        }
        await db.deleteNote(foundedNote);
        res
          .status(200)
          .json({ sucess: true, message: "Your note have been deleted!" });
      } catch (error) {
        res.status(500).json({ error: "internal server problems" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: "invalid token" });
  }
});

// route to search for title.
router.get("/notes/search", async (req, res) => {
  const { title } = req.query;
  const noteTitle = { title };
  const token = req.headers.authorization;
  try {
    const tokenData = jwt.isTokenValid(token);
    if (tokenData) {
      try {
        const foundedNote = await db.searchNote(noteTitle);
        console.log(foundedNote);
        if (!foundedNote) {
          res.status(404).json({
            message: "no note could be found, try search with full title",
          });
          return;
        }
        res.status(200).json({ success: true, message: foundedNote });
      } catch (error) {
        res.status(500).json({ error: "internal server problems" });
      }
    }
  } catch {
    res.status(400).json({ error: "invalid token" });
  }
});

module.exports = { router };
