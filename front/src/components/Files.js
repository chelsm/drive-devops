import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, IconButton, Modal, TextField } from "@mui/material";

const Container = styled("div")`
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .wrap {
    display: flex;
    flew-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
  }

  .wrap-file {
    width: 200px;
    height: 200px;
    padding: 1em;
    border-radius: 40px;
    text-align: center;
    background-color: #3a4654;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .buttons {
    button {
      margin: 1em;
    }
  }
`;

const ContainerModal = styled("div")`
  background-color: white;
  padding: 3rem;
`;

const ModalWrap = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const AddFileModal = ({
  open,
  handleClose,
  handleAddFile,
  uploadedFile,
  setUploadedFile,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", uploadedFile);

    handleAddFile(formData);
  };

  const handleFileSelect = (e) => {
    setUploadedFile(e.target.files[0]);
  };
  return (
    <ModalWrap open={open} onClose={handleClose} className="modal">
      <ContainerModal>
        <h2>Ajouter un fichier</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileSelect}
          />
          <Button type="submit" variant="contained">
            Ajouter
          </Button>
        </form>
      </ContainerModal>
    </ModalWrap>
  );
};

const Files = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [addDirectoryModalOpen, setAddDirectoryModalOpen] = useState(false);
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await apiClient.post("/files", {
        path: "testDir",
        username: "test",
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const createDirectory = async () => {
    try {
      await apiClient.post("/create-directory", {
        path: "new-directory",
        username: "test",
      });
      fetchFiles();
    } catch (error) {
      console.error("Error creating directory:", error);
    }
  };

  const deleteFile = async (fileName) => {
    try {
      await apiClient.post("/delete", {
        path: fileName,
        username: "test",
      });
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleAddDirectory = async () => {
    try {
      await apiClient.post("/create-directory", {
        path: "sss/ddd",
        username: "test",
      });
      fetchFiles();
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  const handleAddFile = async (formData) => {
    formData.append("path", "/");
    formData.append("username", "test");

    try {
      await axios({
        method: "post",
        url: "http://localhost:3000/save",
        data: formData,
        headers: {
            "Content-Type": "multipart/form-data",
        }
      })

      fetchFiles();
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  return (
    <Container>
      <h1>Liste des fichiers</h1>

      <div className="buttons">
        <Button onClick={createDirectory} variant="contained">
          Ajouter un dossier
        </Button>
        <Button variant="contained" onClick={() => setAddFileModalOpen(true)}>
          Ajouter un fichier
        </Button>
      </div>

      <div className="wrap">
        {files.map((file, index) => (
          <div key={index} className="wrap-file">
            <InsertDriveFileOutlinedIcon fontSize="large" />
            <div>
              {file.name}
              <IconButton>
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <AddFileModal
        open={addFileModalOpen}
        handleClose={() => setAddFileModalOpen(false)}
        handleAddFile={handleAddFile}
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
      />
    </Container>
  );
};

export default Files;
