import React from "react";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";


const LgButton = styled(Button)`
    margin: 1em;
    padding: 5px
`;

const LogOutButton = () => {
    return(
        <LgButton
            varient="contained"
            href="/"
            color="primary"
        >
            Se déconnecter
        </LgButton>
    )
}

export default LogOutButton;