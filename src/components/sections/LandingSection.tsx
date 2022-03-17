import { Typography, Button, Box } from "@mui/material";
import { useEffect } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import withSection, { ISectionProps } from "../hocs/withSection";

const LandingSection = ({ fullpageApi }: ISectionProps) => {
    const { token, login } = useAuthentication();

    useEffect(() => {
        if (token) fullpageApi.moveTo(2, 0); // To artists section
    }, [token]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2.5,
                }}
            >
                <Typography
                    variant="h2"
                    component="div"
                    color="textPrimary"
                    gutterBottom
                    sx={{
                        fontWeight: 600,
                        mb: 1,
                    }}
                >
                    Majoritify
                </Typography>
                <Typography color="textPrimary" variant="overline">
                    Listen to others
                </Typography>
            </Box>
            {token ? (
                <Typography variant="button">Logged In</Typography>
            ) : (
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                        login();
                    }}
                >
                    Login with Spotify
                </Button>
            )}
        </>
    );
};

export default withSection(LandingSection);
