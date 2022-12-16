import { Replay, Save, PlaylistAddCheck } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
    Typography,
    Button,
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
import { arrayChunks, fetchPagingAsync } from "../../modules/Utils";
import FadeSpinner from "../common/FadeSpinner";
import SecondaryTypography from "../common/SecondaryTypography";
import withSection, { ISectionProps } from "../hocs/withSection";

const AlbumsSection = ({ fullpageApi }: ISectionProps) => {
    const { albums, clearState } = useForm();
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
                            return await fetchPagingAsync(
                                (offset) =>
                                    spotify.getAlbumTracks(album.id, {
                                        limit: 50,
                                        offset: offset * 50,
                                    }),
                                album.total_tracks,
                                50
                            );
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

    const [saving, setSaving] = useState<boolean>(false);
    const [playlistURI, setPlaylistURI] = useState("");
    const savePlaylist = useCallback(async () => {
        setSaving(true);
        const playlist = await spotify.createPlaylist(user?.id ?? "", {
            name: "Generated Playlist",
            public: false,
        });
        await spotify.addTracksToPlaylist(
            playlist.id,
            results.map((t) => t.uri)
        );
        setPlaylistURI(playlist.uri);
        setSaving(false);
    }, [results]);

    const handleStartOver = useCallback(() => {
        fullpageApi.moveTo(2, 0); // To artists section
        clearState();
        setPlaylistURI("");
        setResults([]);
    }, [fullpageApi]);

    return (
        <FadeSpinner in={!!results.length}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h4" component="div" color="textPrimary">
                    Your playlist
                </Typography>
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
                                                <SecondaryTypography>
                                                    {track.artists
                                                        .map((a) => a.name)
                                                        .join(", ")}
                                                </SecondaryTypography>
                                            </TableCell>
                                            <TableCell>
                                                <SecondaryTypography>
                                                    {track.album.name}
                                                </SecondaryTypography>
                                            </TableCell>
                                            <TableCell>
                                                <SecondaryTypography>
                                                    {minutes}:
                                                    {(seconds ?? 10) < 10
                                                        ? "0"
                                                        : ""}
                                                    {seconds}
                                                </SecondaryTypography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                    }}
                >
                    <LoadingButton
                        variant="contained"
                        onClick={() => {
                            savePlaylist();
                        }}
                        startIcon={
                            playlistURI ? <PlaylistAddCheck /> : <Save />
                        }
                        sx={{ flexGrow: 1, flexBasis: 0 }}
                        loading={saving}
                        disabled={!!playlistURI}
                    >
                        {playlistURI ? "Saved" : "Save as a playlist"}
                    </LoadingButton>

                    <Button
                        variant="contained"
                        onClick={() => {
                            window.open(playlistURI);
                        }}
                        startIcon={
                            <img
                                src="/Spotify_Icon_RGB_White.png"
                                alt="image"
                                style={{
                                    height: "1em",
                                }}
                            />
                        }
                        sx={{
                            flexGrow: 1,
                            flexBasis: 0,
                        }}
                        disabled={!playlistURI}
                    >
                        Listen on Spotify
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleStartOver}
                        startIcon={<Replay />}
                        sx={{ flexGrow: 1, flexBasis: 0 }}
                    >
                        Start over
                    </Button>
                </Box>
            </Box>
        </FadeSpinner>
    );
};

export default withSection(AlbumsSection);
