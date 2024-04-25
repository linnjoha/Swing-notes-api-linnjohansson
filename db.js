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

const findNote = (note) => {
  return db.notes.findOne(note);
};

const updateNote = (note) => {};

module.exports = { addUser, findUser, findAllNotes, addNote };
