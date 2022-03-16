import { Typography, Button } from "@mui/material";
import withSection, { ISectionProps } from "../hocs/withSection";

const ArtistsSection = ({ fullpageApi }: ISectionProps) => {
    return (
        <>
            <Typography variant="h4" component="div" gutterBottom>
                Select artist
            </Typography>
            <Button
                variant="contained"
                onClick={() => {
                    fullpageApi.moveTo(3, 0); // To albums section
                }}
            >
                Next
            </Button>
        </>
    );
};

export default withSection(ArtistsSection);
