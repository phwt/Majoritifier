import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
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

                const tracks = (await spotify.getTracks(albumTracks)).tracks;
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
            <Typography variant="h4" component="div" gutterBottom>
                Your playlist
            </Typography>
            <List
                sx={{
                    overflowY: "auto",
                    maxHeight: "80vh",
                }}
            >
                {results.map((track) => (
                    <ListItem key={track.id}>
                        <ListItemText>
                            {track.name} - {track.popularity}
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            <Button
                variant="contained"
                onClick={() => {
                    savePlaylist();
                }}
            >
                Save as playlist
            </Button>
            <Button
                variant="contained"
                onClick={() => {
                    fullpageApi.moveTo(2, 0); // To artists section
                }}
            >
                Start over
            </Button>
        </>
    );
};

export default withSection(AlbumsSection);
