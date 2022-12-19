import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";

const LogoutOverlay = () => {
    const { user } = useAuthentication();
    const isUserLoggedIn = useMemo(() => user !== null, [user]);

    const handleButton = useCallback(() => {
        window.location.reload();
    }, []);

    return (
        <>
            {isUserLoggedIn && (
                <Button
                    variant="text"
                    onClick={handleButton}
                    color="secondary"
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        padding: 0,
                        margin: "1em",
                        opacity: 0.7,
                    }}
                >
                    Logout
                </Button>
            )}
        </>
    );
};

export default LogoutOverlay;
