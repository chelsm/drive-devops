import React, { useState } from "react";
import { styled } from "@mui/system";
import { TextField as TextFieldMui, Button, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const LoginCard = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 2em;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Signup = () => {
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");

    const handleLogin = () => {
      navigate("/files");
    };


  return (
    <Container>
      <LoginCard>
        <h1>Créer un compte</h1>
        <TextField label="Identifiant" variant="outlined" />
        <TextField label="Mot de passe" type="password" variant="outlined" />
        <Link href="/login" variant="body2">
          Déjà un compte ? Se connecter
        </Link>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Valider
        </Button>
      </LoginCard>
    </Container>
  );
};

export default Signup;
