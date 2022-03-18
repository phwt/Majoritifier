import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const SecondaryTypography = ({ children }: Props) => {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 300 }}
        >
            {children}
        </Typography>
    );
};

export default SecondaryTypography;
