

import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { TextField as TextFieldMui, Button, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Files = () => {

  useEffect(() => {
    console.log('getAuth files',)
    getAuth()
  } ,[])

  const [pseudo, setPseudo] = useState("");

  const getAuth = async () => {
    try {
      const auth = await axios.get('http://localhost:3001/authentifie');
      console.log('auth', auth);
    } catch (error) {
      console.error('Erreur de connexion :', error);
    }
  }



return(  <>
    <h1>Liste des fichiers</h1>
  </>)
};

export default Files;
