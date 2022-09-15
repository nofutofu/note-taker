// all imports
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

// writes the updated notes to the json file
const writeToJson = (destination, content) =>
fs.writeFile(destination, JSON.stringify(content, null, 3), (err) =>{
if(err) { console.error(err)}}
);

// takes the current data from the json file and stores it in a variable
const rewriteJson = (content, file) => {
fs.readFile(file, 'utf8', (err, data) => {
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    writeToJson(file, parsedData);
});
};

// get request for the default note page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// posts the incoming note to the json file
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    if(req.body) {
    const {title, text} = req.body;

        const newNote = {
          title,
          text,
          id: uuidv4(),
        };
          rewriteJson(newNote, './db/notes.json');
          res.json('Note has been added!');
        } else {
            res.error('Error in adding note. :*(');
        }
});

// gets the raw data from the json file
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/notes.json')));

// deletes the specified note by id from the json file
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/notes.json', 'utf8', (err, data) => {
        let parsedData = JSON.parse(data);
        const deleted = parsedData.find(data => data.id === req.params.id)
        if (deleted) {
            parsedData = parsedData.filter(data => data.id != req.params.id)
            res.json('Deleted note');
            writeToJson('./db/notes.json', parsedData);
        } else {
            res.json('Failed to delete note.');
        }
    });
});

// defaults to the landing page if any other path it selected
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () => console.log(`App is listening at http://localhost:${PORT}`));