import React, { useState } from "react";
import { styled } from "@mui/system";
import { TextField as TextFieldMui, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const TextField = styled(TextFieldMui)`
  min-width: 450px;
  margin-bottom: 1em;
`;

const SignupCard = styled("form")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 2em;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Warning = styled("span")`
  color: red;
  font-weight: bold;
`;

const Signup = () => {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(true);
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = () => {
  //   navigate("/files");
  // };

  const handleSignup = async (e) => {
    e.preventDefault();

    console.log("click signup");
    console.log(pseudo, password);
    try {
      const response = await axios.post("http://localhost:3001/signup", {
        pseudo,
        password,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
    setIsComplete(pseudo && password);
  };

  return (
    <Container>
      <SignupCard onSubmit={handleSignup}>
        <h1>Créer un compte</h1>
        <TextField
          label="Identifiant"
          variant="outlined"
          onChange={(e) => setPseudo(e.target.value)}
        />
        <TextField
          label="Mot de passe"
          type="password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link href="/login" variant="body2">
          Déjà un compte ? Se connecter
        </Link>
        {!isComplete && <Warning>Veuillez remplir le formulaire</Warning>}

        <Button variant="contained" color="primary" type="submit">
          Valider
        </Button>
      </SignupCard>
    </Container>
  );
};

export default Signup;
