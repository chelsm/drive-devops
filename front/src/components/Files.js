import React, { useState, useEffect } from "react";
import LogOutButton from "./LogOutButton";
import axios from "axios";

const Files = () => {
  useEffect(() => {
    console.log("getAuth files");
    getAuth();
  }, []);

  const [pseudo, setPseudo] = useState("");

  const getAuth = async () => {
    try {
      const auth = await axios.get("http://localhost:3001/authentifie");
      setPseudo(auth.data.user);
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <>
      <LogOutButton />
      <h1>Liste des fichiers</h1>
    </>
  );
};

export default Files;
