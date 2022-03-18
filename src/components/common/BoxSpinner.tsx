import { Box, CircularProgress } from "@mui/material";

interface Props {
    height: string | number;
}

const BoxSpinner = ({ height }: Props) => {
    return (
        <Box
            sx={{
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: {
                    xs: "100vw",
                    md: "50vw",
                },
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default BoxSpinner;
