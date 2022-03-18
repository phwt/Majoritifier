import { QueueMusic } from "@mui/icons-material";
import {
    Typography,
    Button,
    Checkbox,
    Avatar,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Box,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import FadeSpinner from "../common/FadeSpinner";
import SecondaryTypography from "../common/SecondaryTypography";
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
        <FadeSpinner in={!!albumOptions.length}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h4" component="div" color="textPrimary">
                    Select albums
                </Typography>
                <Paper
                    sx={{
                        overflowY: "auto",
                        maxHeight: "80vh",
                        width: {
                            xs: "100vw",
                            md: "50vw",
                        },
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableBody>
                                {albumOptions.map((album) => {
                                    const checked =
                                        localAlbums.indexOf(album) !== -1;

                                    return (
                                        <TableRow
                                            key={album.id}
                                            hover
                                            selected={checked}
                                            onClick={() => {
                                                handleListClick(album);
                                            }}
                                            role="checkbox"
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={checked} />
                                            </TableCell>
                                            <TableCell padding="checkbox">
                                                <Avatar
                                                    variant="square"
                                                    src={album.images[0]?.url} // TODO: Filter for optimal image
                                                    alt={album.name}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {album.name}
                                                <SecondaryTypography>
                                                    {(
                                                        album as SpotifyApi.AlbumObjectFull
                                                    ).release_date.slice(0, 4)}
                                                </SecondaryTypography>
                                            </TableCell>
                                            <TableCell>
                                                <SecondaryTypography>
                                                    {(
                                                        album as AlbumObjectResponse
                                                    ).total_tracks.toLocaleString()}{" "}
                                                    tracks
                                                </SecondaryTypography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <Button
                    variant="contained"
                    onClick={() => {
                        setAlbums(localAlbums);
                        fullpageApi.moveTo(4, 0); // To result section
                    }}
                    startIcon={<QueueMusic />}
                >
                    Create a playlist
                </Button>
            </Box>
        </FadeSpinner>
    );
};

export default withSection(AlbumsSection);
