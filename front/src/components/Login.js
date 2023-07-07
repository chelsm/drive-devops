import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { TextField as TextFieldMui, Button, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  h1 {
    font-size: 3rem;
    color: #45a29e;
  }
`;

const Warning = styled("span")`
  color: red;
  font-weight: bold;
`;

const TextField = styled(TextFieldMui)`
  min-width: 450px;
  margin-bottom: 1em;
`;

const LoginCard = styled("form")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 2em;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Login = () => {
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log('getAuth log',)
    getAuth()

  } ,[isValid])

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const log = await axios.post('http://localhost:3001/login', {
        login,
        password
      });
      setIsValid(true)
      navigate("/files");

    } catch (error) {
      setIsValid(false)
      console.error('Erreur de connexion :', error);
    }
  };


  const getAuth = async () => {
    try {
      const auth = await axios.get('http://localhost:3001/authentifie');
      console.log('auth', auth);
    } catch (error) {
      console.error('Erreur de connexion :', error);
    }
  }


  return (
    <Container>
      <LoginCard onSubmit={handleLogin}>
        <h1>Se connecter</h1>
          <TextField
            label="Identifiant"
            variant="outlined"
            onChange={(e) => setLogin(e.target.value)} 
          />
          <TextField 
            label="Mot de passe"
            type="password"
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)} 
          />
          {!isValid && <Warning>Utilisateur inconnu</Warning>}

          <Link href="/signup" variant="body2">
            {"Pas encore de compte ? S'inscrire"}
          </Link>
          <Button variant="contained" color="primary" type="submit">
            Se connecter
          </Button>
      </LoginCard>
    </Container>
  );
};

export default Login;
