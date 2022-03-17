import { Replay, Save } from "@mui/icons-material";
import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Box,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import { arrayChunks } from "../../modules/Utils";
import withSection, { ISectionProps } from "../hocs/withSection";

const AlbumsSection = ({ fullpageApi }: ISectionProps) => {
    const { albums } = useForm();
    const spotify = useSpotify();
    const { user } = useAuthentication();

    const [results, setResults] = useState<SpotifyApi.TrackObjectFull[]>([]);

    useEffect(() => {
        if (albums.length) {
            (async () => {
                setResults([]);

                const albumTracks = (
                    await Promise.all(
                        albums.map(async (album) => {
                            return (
                                await spotify.getAlbumTracks(album.id)
                            ).items.map((t) => t.id);
                        })
                    )
                ).flat();

                const albumTracksChunks = arrayChunks(albumTracks, 50);

                const tracks = (
                    await Promise.all(
                        albumTracksChunks.map(async (chunk) => {
                            return (await spotify.getTracks(chunk)).tracks;
                        })
                    )
                ).flat();

                setResults(
                    [...tracks].sort((i, j) => j.popularity - i.popularity)
                );
            })();
        }
    }, [albums]);

    const savePlaylist = useCallback(async () => {
        const playlist = await spotify.createPlaylist(user?.id ?? "", {
            name: "Generated Playlist",
            public: false,
        });
        await spotify.addTracksToPlaylist(
            playlist.id,
            results.slice(0, 10).map((t) => t.uri)
        );
    }, [results]);

    return (
        <>
            <Typography
                variant="h4"
                component="div"
                color="textPrimary"
                gutterBottom
            >
                Your playlist
            </Typography>
            <List
                sx={{
                    overflowY: "auto",
                    maxHeight: "75vh",
                    width: {
                        xs: "100vw",
                        md: "50vw",
                    },
                }}
            >
                {results.map((track) => (
                    <ListItem key={track.id}>
                        <ListItemText
                            primaryTypographyProps={{
                                color: "textPrimary",
                            }}
                        >
                            {track.name} - {track.popularity}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                }}
            >
                <Button
                    variant="contained"
                    onClick={() => {
                        savePlaylist();
                    }}
                    startIcon={<Save />}
                >
                    Save as playlist
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        fullpageApi.moveTo(2, 0); // To artists section
                    }}
                    startIcon={<Replay />}
                >
                    Start over
                </Button>
            </Box>
        </>
    );
};

export default withSection(AlbumsSection);
