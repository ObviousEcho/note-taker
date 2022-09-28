const notes = require('express').Router();
const fs = require('fs');

notes.get('/', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        // err ? console.error(err) : console.log(data);
        if(err) {
            console.error(err);
        } else {
            console.log(data);
            res.json(data);
        }
    })
    
})

module.exports = notes;