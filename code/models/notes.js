const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let NoteSchema = new Schema({
    text: String,
    buttonId: String
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
