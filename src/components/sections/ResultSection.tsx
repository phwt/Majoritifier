import { Typography, Button } from "@mui/material";
import withSection, { ISectionProps } from "../hocs/withSection";

const AlbumsSection = ({ fullpageApi }: ISectionProps) => {
    return (
        <>
            <Typography variant="h4" component="div" gutterBottom>
                Your playlist
            </Typography>
            <Button
                variant="contained"
                onClick={() => {
                    fullpageApi.moveTo(2, 0); // To artists section
                }}
            >
                Start over
            </Button>
        </>
    );
};

export default withSection(AlbumsSection);
