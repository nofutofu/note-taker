const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));


const writeToJson = (destination, content) =>
fs.writeFile(destination, JSON.stringify(content, null, 3), (err) =>{
if(err) { console.error(err)}}
);

const rewriteJson = (content, file) => {
fs.readFile(file, 'utf8', (err, data) => {
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    writeToJson(file, parsedData);
});
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.post('/api/notes', (req, res) => {
    console.log(req.body);
    const {title, text} = req.body;

        const newNote = {
          title,
          text,
          id: uuidv4(),
        };

          rewriteJson(newNote, './db/db.json');
});

app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        let parsedData = JSON.parse(data);
        const deleted = parsedData.find(data => data.id === req.params.id)
        if (deleted) {
            parsedData = parsedData.filter(data => data.id != req.params.id)
        }
        writeToJson('./db/db.json', parsedData);
    });
});

app.listen(PORT, () => console.log(`App is listening at http://localhost:${PORT}`));