import { Typography, Button } from "@mui/material";
import withSection, { ISectionProps } from "../hocs/withSection";

const AlbumsSection = ({ fullpageApi }: ISectionProps) => {
    return (
        <>
            <Typography variant="h4" component="div" gutterBottom>
                Select albums
            </Typography>
            <Button
                variant="contained"
                onClick={() => {
                    fullpageApi.moveTo(4, 0); // To result section
                }}
            >
                Next
            </Button>
        </>
    );
};

export default withSection(AlbumsSection);
