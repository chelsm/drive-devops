import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button } from "@mui/material";
import AddDirectoryModal from "./AddDirectoryModal";
import AddFileModal from "./AddFileModal";
import { useLocation, useNavigate } from "react-router-dom";

const Container = styled("div")`
  max-width: 1200px;
  margin: 0 6rem;
  padding-bottom: 4rem;
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

  .directory:hover {
    background-color: #1976d2;
    cursor: pointer;
  }

  .buttons {
    button {
      margin: 1em;
    }
  }
`;

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const Files = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const trimmedPath = (data) => data.replace(/^\/files/, "");

  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState(trimmedPath(path));
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [openDirectoryModal, setOpenDirectoryModal] = useState(false);

  const handleCloseModalDirectory = () => {
    setOpenDirectoryModal(false);
  };

  const handleCloseModalFile = () => {
    setAddFileModalOpen(false);
    fetchFiles();
  };

  const goToDirectory = async (filePath) => {
    setCurrentPath(currentPath + "/"+ filePath);
    navigate(filePath);
  };

  useEffect(() => {
    fetchFiles();
  }, [currentPath]);

  const fetchFiles = async () => {
    console.log("Fetching files...");
    try {
      const response = await apiClient.post("/files", {
        path: currentPath,
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
          <React.Fragment key={index}>
            {file.type === "file" ? (
              <div className="wrap-file">
                <InsertDriveFileOutlinedIcon fontSize="large" />
                <div>{file.name.slice(0, 20)}</div>
              </div>
            ) : (
              <div
                className="wrap-file directory"
                onClick={() => goToDirectory(file.name)}
              >
                <FolderOpenIcon fontSize="large" />
                <div>{file.name.slice(0, 20)}</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <AddFileModal
        open={addFileModalOpen}
        handleClose={handleCloseModalFile}
        currentPath={currentPath}
      />

      <AddDirectoryModal
        handleCloseModalDirectory={handleCloseModalDirectory}
        openDirectoryModal={openDirectoryModal}
        currentPath={currentPath}
      />
    </Container>
  );
};

export default Files;
