import React, { useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import { Button, Modal } from "@mui/material";

const Wrap = styled("div")`
  background: white;
  margin: auto;
  padding: 3rem;
`;

const AddFileModal = ({ open, handleClose, currentPath }) => {
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
    formData.append("path", currentPath);
    formData.append("username", "test");

    try {
      await axios({
        method: "post",
        url: "http://nginx:8080/save",
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
      <Wrap>
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
      </Wrap>
    </Modal>
  );
};

export default AddFileModal;
