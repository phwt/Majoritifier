import { Replay, Save } from "@mui/icons-material";
import {
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Box,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TableContainer,
    Avatar,
} from "@mui/material";
import { intervalToDuration } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import { arrayChunks } from "../../modules/Utils";
import BoxSpinner from "../common/BoxSpinner";
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
            {results.length ? (
                <Paper
                    sx={{
                        overflowY: "auto",
                        maxHeight: "75vh",
                        width: {
                            xs: "100vw",
                            md: "50vw",
                        },
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableBody>
                                {results.map((track, index) => {
                                    const { minutes, seconds } =
                                        intervalToDuration({
                                            start: 0,
                                            end: track.duration_ms,
                                        });

                                    return (
                                        <TableRow key={track.id}>
                                            <TableCell align="center">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell padding="checkbox">
                                                <Avatar
                                                    variant="square"
                                                    src={
                                                        track.album.images[0]
                                                            ?.url
                                                    } // TODO: Filter for optimal image
                                                    alt={track.name}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {track.name}
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 300 }}
                                                >
                                                    {track.artists
                                                        .map((a) => a.name)
                                                        .join(", ")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 300 }}
                                                >
                                                    {track.album.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 300 }}
                                                >
                                                    {minutes}:
                                                    {(seconds ?? 10) < 10
                                                        ? "0"
                                                        : ""}
                                                    {seconds}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            ) : (
                <BoxSpinner height="75vh" />
            )}

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
                    color="secondary"
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
