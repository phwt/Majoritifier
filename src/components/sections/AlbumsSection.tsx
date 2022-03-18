import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    ListItemButton,
    ListItemIcon,
    Avatar,
    ListItemAvatar,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import withSection, { ISectionProps } from "../hocs/withSection";

interface AlbumObjectResponse extends SpotifyApi.AlbumObjectFull {
    total_tracks: number;
}

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
            <Typography
                variant="h4"
                component="div"
                color="textPrimary"
                gutterBottom
            >
                Select albums ({albumOptions.length})
            </Typography>
            <List
                sx={{
                    overflowY: "auto",
                    maxHeight: "80vh",
                    width: {
                        xs: "100vw",
                        md: "50vw",
                    },
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
                            <ListItemAvatar>
                                <Avatar
                                    variant="square"
                                    src={album.images[0]?.url} // TODO: Filter for optimal image
                                    alt={album.name}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primaryTypographyProps={{
                                    color: "textPrimary",
                                }}
                            >
                                {album.name}
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 300,
                                    }}
                                >
                                    {(
                                        album as SpotifyApi.AlbumObjectFull
                                    ).release_date.slice(0, 4)}{" "}
                                    ∙{" "}
                                    {
                                        (album as AlbumObjectResponse)
                                            .total_tracks
                                    }{" "}
                                    tracks
                                </Typography>
                            </ListItemText>
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
