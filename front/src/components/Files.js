import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button, IconButton, Modal, TextField } from "@mui/material";
import AddDirectoryModal from "./AddDirectoryModal";
import AddFileModal from "./AddFileModal";

const Container = styled("div")`
  max-width: 1200px;
  margin: 0 6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2rem;
  }

  .wrap-file {
    width: 180px;
    height: 180px;
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


const Files = () => {
  const [files, setFiles] = useState([]);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [openDirectoryModal, setOpenDirectoryModal] = useState(false);

  const handleCloseModalDirectory = () => {
    setOpenDirectoryModal(false);
  };

  const openFileModal = () => {
    setAddFileModalOpen(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await apiClient.post("/files", {
        path: "/",
        username: "test",
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  return (
    <Container>
      <h1>Liste des fichiers</h1>

      <div className="buttons">
        <Button onClick={() => setOpenDirectoryModal(true)} variant="contained">
          Ajouter un dossier
        </Button>
        <Button variant="contained" onClick={() => setAddFileModalOpen(true)}>
          Ajouter un fichier
        </Button>
      </div>

      <div className="wrap">
        {files.map((file, index) => (
          <div key={index} className="wrap-file">
            {file.type === "file" ? (
              <InsertDriveFileOutlinedIcon fontSize="large" />
            ) : (
              <FolderOpenIcon fontSize="large" />
            )}
            <div>{file.name.slice(0, 20)}</div>
          </div>
        ))}
      </div>

      <AddFileModal open={addFileModalOpen} handleClose={openFileModal} />
      <AddDirectoryModal
        handleCloseModalDirectory={handleCloseModalDirectory}
        openDirectoryModal={openDirectoryModal}
      />
    </Container>
  );
};

export default Files;
