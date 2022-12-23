import { Button } from "@mui/material";
import { useCallback, useMemo } from "react";

interface Props {
    type: string;
    id: string;
    text?: string;
}

const LinkButton = ({ type, id, text = "Open Spotify" }: Props) => {
    const handleClick = useCallback((event) => {
        event.stopPropagation();
    }, []);

    const buttonHref = useMemo(() => {
        return `https://open.spotify.com/${type}/${id}`;
    }, [type, id]);

    return (
        <Button
            variant="outlined"
            size="small"
            target="_blank"
            href={buttonHref}
            onClick={handleClick}
            sx={{
                marginTop: "0.5em",
            }}
            startIcon={
                <img
                    src="/Spotify_Icon_RGB_Green.png"
                    alt="image"
                    style={{
                        height: "1em",
                    }}
                />
            }
        >
            {text}
        </Button>
    );
};

export default LinkButton;
