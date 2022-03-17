import { Typography, Button } from "@mui/material";
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
            <Typography
                variant="h3"
                component="div"
                color="textPrimary"
                gutterBottom
            >
                Majoritify
            </Typography>
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
