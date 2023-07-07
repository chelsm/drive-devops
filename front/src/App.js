import React from "react";
import { styled } from "@mui/system";
import MainRouter from "./components/MainRouter";

const Main = styled("main")`
  width: 100%;
  min-height: 100vh;
  background-color: #1f2833;
  color: #c5c6c7;
`;

const App = () => {
  return (
    <Main>
      <MainRouter />
    </Main>
  );
};

export default App;
