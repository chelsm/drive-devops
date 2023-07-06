// Express server for the file system

const fs = require('fs');
const multer = require('multer');
const express = require('express');
const app = express();
const port = 3000;
const upload = multer();

app.use(express.static('public'));
app.use(express.json());

function saveFile(path, fileFromRequest) {
    fs.writeFile(path + '/' + fileFromRequest.originalname, fileFromRequest.buffer, (err) => {
        if (err) throw err;
    });
}

function createDirectory(path) {
    fs.mkdirSync(path);
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function getFiles(path = '') {
    const content = fs.readdirSync('./files/' + path);

    return content.map((file) => {
        return {
            "type": isDirectory('./files/' + path + '/' + file) ? 'directory' : 'file',
            "name": file,
        }
    });
}

function clearPath(path) {
    if (!path) return '';

    path = path.replace('..', '');
    path = path.replace('//', '/');

    if (path[0] === '/') {
        path = path.substring(1);
    }

    if (path[path.length - 1] === '/') {
        path = path.substring(0, req.path.length - 1);
    }

    return path;
}

function deleteFileOrDirectory(path) {
    if (isDirectory(path)) {
        fs.rmdirSync(path);
    } else {
        fs.unlinkSync(path);
    }
}

// Request handler to return all files in the file system as JSON
app.post('/files', (req, res) => {
    const path = clearPath(req.body.path);

    res.json(getFiles(path));
});

// Request handler to save a file to the file system
app.post('/save', upload.array(), (req, res) => {
    const path = clearPath(req.body.path);

    if (req.files.length === 0) {
        res.send('No file uploaded!');
        return;
    }

    if (!fs.existsSync('./files/' + path)) {
        createDirectory('./files/' + path);
    }

    saveFile('./files/' + req.body.path, req.files[0]);
    res.send('File saved!');
});

// Request handler to create a directory in the file system
app.post('/create-directory', (req, res) => {
    const path = clearPath(req.body.path);
    console.log(path)

    createDirectory('./files/' + req.body.path);
    res.send('Directory created!');
});

// Request handler to delete a file
app.post('/delete', (req, res) => {
    const path = clearPath(req.body.path);

    deleteFileOrDirectory('./files/' + path);
    res.send('Element deleted!');
})

app.listen(port, () => console.log(`File system listening on port ${port}!`));
