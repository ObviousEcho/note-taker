const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

notes.get("/", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    err ? console.error(err) : res.json(JSON.parse(data));
  });
});

notes.post("/", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uuidv4(),
  };

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);

      parsedNotes.push(newNote);

      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info("Successfully added note!")
      );
    }
  });
  const response = {
    status: "success",
    body: newNote,
  };
  console.log(response);
  res.status(201).json(response);
});

notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      const result = parsedNotes.filter((note) => note.note_id !== noteId);
      console.log(result);

      fs.writeFile(
        "./db/db.json",
        JSON.stringify(result, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : res.json(`Note ${noteId} has been deleted 🗑️`)
      );
    }
  });
});

module.exports = notes;
