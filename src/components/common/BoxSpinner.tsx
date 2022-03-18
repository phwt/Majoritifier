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
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default BoxSpinner;
