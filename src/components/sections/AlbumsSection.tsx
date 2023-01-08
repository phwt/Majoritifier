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
    TextField,
    debounce,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import { AlbumObjectResponse } from "../../models/AlbumObjectResponse";
import FadeSpinner from "../common/FadeSpinner";
import LinkButton from "../common/LinkButton";
import SecondaryTypography from "../common/SecondaryTypography";
import withSection, { ISectionProps } from "../hocs/withSection";

const AlbumsSection = ({ fullpageApi }: ISectionProps) => {
    const { artist, setAlbums } = useForm();
    const { user } = useAuthentication();
    const spotify = useSpotify();

    const [localAlbums, setLocalAlbums] = useState<
        SpotifyApi.AlbumObjectSimplified[]
    >([]);

    useEffect(() => {
        if (!artist) setLocalAlbums([]);
    }, [artist]);

    const [albumOptions, setAlbumOptions] = useState<
        SpotifyApi.AlbumObjectSimplified[]
    >([]);
    const [defaultAlbumOptions, setDefaultAlbumOptions] = useState<
        SpotifyApi.AlbumObjectSimplified[]
    >([]);

    useEffect(() => {
        if (artist) {
            (async () => {
                const albums = await spotify.getArtistAlbums(artist.id, {
                    market: user?.country,
                });
                setAlbumOptions(albums.items);
                setDefaultAlbumOptions(albums.items);
            })();
        }
    }, [artist]);

    const handleListClick = useCallback(
        (album: SpotifyApi.AlbumObjectSimplified) => {
            if (localAlbums.indexOf(album) !== -1) {
                setLocalAlbums(localAlbums.filter((a) => a.id !== album.id));
            } else {
                setLocalAlbums([...localAlbums, album]);
            }
        },
        [localAlbums]
    );

    const albumIDs = useMemo(() => localAlbums.map((a) => a.id), [localAlbums]);

    const renderOptions = useMemo(
        () => (
            <>
                {albumOptions.map((album) => {
                    const checked = albumIDs.indexOf(album.id) !== -1;

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
                                <LinkButton type="album" id={album.id} />
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
            </>
        ),
        [albumOptions, albumIDs]
    );

    const [searchText, setSearchText] = useState("");

    const fetch = useMemo(
        () =>
            debounce(async (value) => {
                const albums = await spotify.searchAlbums(
                    // ! Can't search by ID irrelevant albums might also be returned such as a cover album that also attributed to the original artist
                    `album:${value} artist:${artist?.name}`,
                    {
                        type: "album",
                        market: user?.country,
                    }
                );
                setAlbumOptions(albums.albums.items);
            }, 200),
        [user, artist]
    );

    useEffect(() => {
        if (searchText.length > 3) {
            (async () => {
                await fetch(searchText);
            })();
        } else {
            setAlbumOptions(defaultAlbumOptions);
        }
    }, [searchText]);

    return (
        <FadeSpinner in={!!albumOptions.length || searchText !== ""}>
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
                <TextField
                    label="Search"
                    variant="filled"
                    fullWidth
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                    }}
                />
                <Paper
                    sx={{
                        overflowY: "auto",
                        maxHeight: "75vh",
                        width: {
                            xs: "95vw",
                            md: "75vw",
                            lg: "50vw",
                        },
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableBody>{renderOptions}</TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <Button
                    variant="contained"
                    onClick={() => {
                        setAlbums(localAlbums as AlbumObjectResponse[]);
                        fullpageApi.moveTo(4, 0); // To result section
                    }}
                    disabled={!localAlbums.length}
                    startIcon={<QueueMusic />}
                >
                    Create a playlist
                </Button>
            </Box>
        </FadeSpinner>
    );
};

export default withSection(AlbumsSection);
