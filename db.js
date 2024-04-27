const nedb = require("nedb-promise");

const db = {};
db.users = new nedb({ filename: "users.db", autoload: true });
db.notes = new nedb({ filename: "notes.db", autoload: true });

const addUser = (username, password) => {
  return db.users.insert({ username: username, password: password });
};

const findUser = (username) => {
  return db.users.findOne({ username: username });
};

//notesdb
const findAllNotes = () => {
  return db.notes.find({});
};

const addNote = (note) => {
  return db.notes.insert(note);
};

//serach for note with _id or title
const searchNote = (note) => {
  return db.notes.findOne({ $or: [{ _id: note._id }, { title: note.title }] });
};

const updateNote = (foundedNote, note) => {
  const updatedNote = db.notes.update(
    {
      title: foundedNote.title,
      text: foundedNote.text,
      modifiedAt: foundedNote.modifiedAt,
    },
    { $set: { title: note.title, text: note.text, modifiedAt: new Date() } }
  );
  return updatedNote;
};
const deleteNote = (note) => {
  return db.notes.remove({ _id: note._id });
};

module.exports = {
  addUser,
  findUser,
  findAllNotes,
  addNote,
  updateNote,
  searchNote,
  deleteNote,
};
