import React from "react";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";

const Container = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2em;
  height: 100%;

  h1 {
    font-size: 4rem;
    color: #66fcf1;
  }

  p {
    font-size: 1.2rem;
  }

  .btn {
    margin: 1em;
  }
`;

const Home = () => {
  return (
    <Container>
      <h1>Bienvenue sur EfreiDrive</h1>
      <p>
        Stockez vos photos et fichiers sur EfreiDrive pour y accéder depuis
        n’importe quel appareil, où que vous soyez.
      </p>
      <div>
        <Button variant="contained" className="btn" href="/login">
          Se connecter
        </Button>
        <Button variant="outlined" className="btn" href="/signup">
          Créer un compte
        </Button>
      </div>
      
    </Container>
  );
};

export default Home;
