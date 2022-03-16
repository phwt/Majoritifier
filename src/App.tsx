import { Button, Container, Typography } from "@mui/material";
import { useAuthentication } from "./contexts/AuthenticationContext";

function App() {
    const { token, login } = useAuthentication();

    return (
        <Container
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
            }}
        >
            <Typography variant="h3" component="div" gutterBottom>
                Majoritify
            </Typography>
            {token ? (
                <pre>{token}</pre>
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
        </Container>
    );
}

export default App;
