const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let NoteSchema = new Schema({
    title: String,
    text: String,
    articleId: String

});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
