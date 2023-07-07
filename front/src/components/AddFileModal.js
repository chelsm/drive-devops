import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Button, IconButton, Modal, TextField } from "@mui/material";

const AddFileModal = ({ open, handleClose }) => {
  const [uploadedFile, setUploadedFile] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", uploadedFile);

    handleAddFile(formData);
  };

  const handleFileSelect = (e) => {
    setUploadedFile(e.target.files[0]);
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
        },
      });

      handleClose();
    } catch (error) {
      console.error("Error adding file:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className="modal">
      <div>
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
      </div>
    </Modal>
  );
};

export default AddFileModal;
