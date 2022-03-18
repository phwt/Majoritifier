import { Fade } from "@mui/material";
import { ReactElement } from "react";
import BoxSpinner from "./BoxSpinner";

interface Props {
    in: boolean;
    children: ReactElement;
}

const FadeSpinner = ({ in: isIn, children }: Props) => {
    return (
        <>
            <Fade in={isIn}>{children}</Fade>
            {!isIn && <BoxSpinner height="100vh" />}
        </>
    );
};

export default FadeSpinner;
