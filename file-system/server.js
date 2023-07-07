// Express server for the file system
const fs = require("fs");
const multer = require("multer");
const express = require("express");
const app = express();
const port = 3000;
const upload = multer();
const cors = require("cors");

app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

function saveFile(path, fileFromRequest) {
  if (!fs.existsSync(path)) {
    createDirectory(path);
  }

  fs.writeFile(
    path + "/" + fileFromRequest.originalname,
    fileFromRequest.buffer,
    (err) => {
      if (err) throw err;
    }
  );
}

function createDirectory(path) {
  fs.mkdirSync(path, { recursive: true });
}

function isDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

function getFiles(path = "") {
  const content = fs.readdirSync("./files/" + path);

  return content.map((file) => {
    return {
      type: isDirectory("./files/" + path + "/" + file) ? "directory" : "file",
      name: file,
    };
  });
}

function clearPath(path, user) {
  if (!path) return "";
  if (user === undefined) return undefined;

  path = path.replace("..", "");
  path = path.replace("//", "/");

  if (path[0] === "/") {
    path = path.substring(1);
  }

  if (path[path.length - 1] === "/") {
    path = path.substring(0, path - 1);
  }

  if (user) path = user + "/" + path;

  return path;
}

function deleteFileOrDirectory(path) {
  try {
    if (isDirectory(path)) {
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }

    return "Element deleted!";
  } catch (err) {
    return "Element not found!";
  }
}

// Request handler to return all files in the file system as JSON
app.post("/files", (req, res) => {
  const path = clearPath(req.body.path, req.body.username);

  res.json(getFiles(path));
});

// Request handler to save a file to the file system
app.post("/save", upload.single('file'), (req, res) => {
  const path = clearPath(req.body.path, req.body.username);

  if (req.file === undefined) {
    res.send("No file uploaded!");
    return;
  }

  if (!fs.existsSync("./files/" + path)) {
    createDirectory("./files/" + path);
  }

  saveFile("./files/" + path, req.file);
  res.send("File saved!");
});

// Request handler to create a directory in the file system
app.post("/create-directory", (req, res) => {
  const path = clearPath(req.body.path, req.body.username);

  createDirectory("./files/" + path);
  res.send("Directory created!");
});

// Request handler to delete a file
app.post("/delete", (req, res) => {
  const path = clearPath(req.body.path, req.body.username);

  res.send(deleteFileOrDirectory("./files/" + path));
});

app.listen(port, () => console.log(`File system listening on port ${port}!`));
