import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    ListItemButton,
    ListItemIcon,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import withSection, { ISectionProps } from "../hocs/withSection";

const AlbumsSection = ({ fullpageApi }: ISectionProps) => {
    const { artist, albums, setAlbums } = useForm();
    const { user } = useAuthentication();
    const spotify = useSpotify();

    const [albumOptions, setAlbumOptions] = useState<
        SpotifyApi.AlbumObjectSimplified[]
    >([]);

    useEffect(() => {
        if (artist) {
            (async () => {
                const albums = await spotify.getArtistAlbums(artist.id, {
                    market: user?.country,
                });
                setAlbumOptions(albums.items);
            })();
        }
    }, [artist]);

    const handleListClick = useCallback(
        (album: SpotifyApi.AlbumObjectSimplified) => {
            if (albums.indexOf(album) !== -1) {
                setAlbums(albums.filter((a) => a !== album));
            } else {
                setAlbums([...albums, album]);
            }
        },
        [albums]
    );

    return (
        <>
            <Typography variant="h4" component="div" gutterBottom>
                Select albums ({albumOptions.length})
            </Typography>
            <List
                sx={{
                    overflowY: "auto",
                    maxHeight: "80vh",
                }}
            >
                {albumOptions.map((album) => (
                    <ListItem key={album.id}>
                        <ListItemButton
                            role={undefined}
                            onClick={() => {
                                handleListClick(album);
                            }}
                            dense
                        >
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={albums.indexOf(album) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText>{album.name}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
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
