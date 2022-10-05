const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// get route for notes
notes.get("/", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    err ? console.error(err) : res.json(JSON.parse(data));
  });
});

// post route for new notes
notes.post("/", (req, res) => {
  console.info(`${req.method} request received to add a note`);
  console.log(req.body);
  const { title, text } = req.body;
  const newNote = {
    title,
    text,
    id: uuidv4(),
  };
// readfile to get current notes
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);

      parsedNotes.push(newNote);
// writefile to add new notes
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
  res.status(201).json(response);
});

// delete route for garbage notes
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  // readfile to get current notes
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      // filter out note if id's match, store leftover notes in result array
      const result = parsedNotes.filter((note) => note.id !== noteId);
// write result array to file
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
