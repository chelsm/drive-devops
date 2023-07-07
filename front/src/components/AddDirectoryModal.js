import React, { useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { Button, TextField, Modal } from "@mui/material";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

const AddDirectoryModal = ({
  handleCloseModalDirectory,
  openDirectoryModal,
}) => {
  const [directoryName, setDirectoryName] = useState("/");

  const handleSubmit = async () => {
    try {
      await apiClient.post("/create-directory", {
        path: directoryName,
        username: "test",
      });
      handleCloseModalDirectory();
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  const Wrap = styled('div')`
    background: white;
  `;

  return (
    <Modal open={openDirectoryModal} onClose={handleCloseModalDirectory}>
      <Wrap>
        <h2>Créer un dossier</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nom du dossier"
            value={directoryName}
            onChange={(event) => setDirectoryName(event.target.value)}
          />
          <Button type="submit">Ajouter</Button>
        </form>
      </Wrap>
    </Modal>
  );
};

export default AddDirectoryModal;
