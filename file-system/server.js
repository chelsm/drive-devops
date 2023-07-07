// Express server for the file system

const fs = require('fs');
const multer = require('multer');
const express = require('express');
const app = express();
const port = 3000;
const upload = multer();
const jwt = require('jsonwebtoken');

app.use(express.static('public'));
app.use(express.json());

function saveFile(path, fileFromRequest) {
    if (!fs.existsSync(path)) {
        createDirectory(path);
    }

    fs.writeFile(path + '/' + fileFromRequest.originalname, fileFromRequest.buffer, (err) => {
        if (err) throw err;
    });
}

function createDirectory(path) {
    fs.mkdirSync(path, { recursive: true });
}

function isDirectory(path) {
    return fs.lstatSync(path).isDirectory();
}

function getFiles(path = '') {
    try {
        const content = fs.readdirSync('./files/' + path);

        return content.map((file) => {
            return {
                "type": isDirectory('./files/' + path + '/' + file) ? 'directory' : 'file',
                "name": file,
            }
        });
    } catch (err) {
        return "Directory not found!";
    }
}

function clearPath(path, user) {
    if (!path) return '';
    if (user === undefined) return undefined;

    path = path.replace('..', '');
    path = path.replace('//', '/');

    if (path[0] === '/') {
        path = path.substring(1);
    }

    if (path[path.length - 1] === '/') {
        path = path.substring(0, path - 1);
    }

    if (user) path = user + '/' + path;

    return path;
}

function deleteFileOrDirectory(path) {
    try {
        if (isDirectory(path)) {
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }

        return 'Element deleted!';
    } catch (err) {
        return 'Element not found!';
    }
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, "myNonSecretKeyDocker", (err, user) => {
        console.log(err);

        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    })
}

// Request handler to return all files in the file system as JSON
app.post('/files', authenticateToken, (req, res) => {
    const path = clearPath(req.body.path, req.body.username);

    res.json(getFiles(path));
});

// Request handler to save a file to the file system
app.post('/save', authenticateToken, upload.array(), (req, res) => {
    const path = clearPath(req.body.path, req.body.username);

    if (req.files.length === 0) {
        res.send('No file uploaded!');
        return;
    }

    if (!fs.existsSync('./files/' + path)) {
        createDirectory('./files/' + path);
    }

    saveFile('./files/' + path, req.files[0]);
    res.send('File saved!');
});

// Request handler to create a directory in the file system
app.post('/create-directory', authenticateToken, (req, res) => {
    const path = clearPath(req.body.path, req.body.username);

    createDirectory('./files/' + path);
    res.send('Directory created!');
});

// Request handler to delete a file
app.post('/delete', authenticateToken, (req, res) => {
    const path = clearPath(req.body.path, req.body.username);

    res.send(deleteFileOrDirectory('./files/' + path));
})

// Request handler to get the content of a file
app.post('/get-file-content', authenticateToken, (req, res) => {
    const path = clearPath(req.body.path, req.body.username);

    console.log(path)

    try {
        res.sendFile(path, { root: './files' })
    } catch (err) {
        res.send('File not found!');
    }
})

app.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, "myNonSecretKeyDocker");
    res.json({ accessToken: accessToken });
})

app.listen(port, () => console.log(`File system listening on port ${port}!`));
