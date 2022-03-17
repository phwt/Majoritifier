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
    const { artist, setAlbums } = useForm();
    const { user } = useAuthentication();
    const spotify = useSpotify();

    const [localAlbums, setLocalAlbums] = useState<
        SpotifyApi.AlbumObjectSimplified[]
    >([]);

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
            if (localAlbums.indexOf(album) !== -1) {
                setLocalAlbums(localAlbums.filter((a) => a !== album));
            } else {
                setLocalAlbums([...localAlbums, album]);
            }
        },
        [localAlbums]
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
                                    checked={localAlbums.indexOf(album) !== -1}
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
                    setAlbums(localAlbums);
                    fullpageApi.moveTo(4, 0); // To result section
                }}
            >
                Next
            </Button>
        </>
    );
};

export default withSection(AlbumsSection);
