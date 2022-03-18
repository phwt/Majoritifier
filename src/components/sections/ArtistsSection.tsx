import {
    Typography,
    Autocomplete,
    TextField,
    Grid,
    Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import withSection, { ISectionProps } from "../hocs/withSection";

const ArtistsSection = ({ state, fullpageApi }: ISectionProps) => {
    const [value, setValue] = useState<SpotifyApi.ArtistObjectFull | null>(
        null
    );
    const [options, setOptions] = useState<
        readonly SpotifyApi.ArtistObjectFull[]
    >([]);
    const [inputValue, setInputValue] = useState("");

    const spotify = useSpotify();
    const { setArtist } = useForm();

    useEffect(() => {
        if (inputValue === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        (async () => {
            const artists = await spotify.searchArtists(inputValue, {
                limit: 10,
            });
            setOptions(artists.artists.items);
        })();
    }, [value, inputValue, fetch]);

    useEffect(() => {
        if (value) {
            setArtist(value);
            fullpageApi.moveTo(3, 0); // To albums section
        }
    }, [value]);

    return (
        <>
            <Typography
                variant="h4"
                component="div"
                color="textPrimary"
                gutterBottom
            >
                Select an artist
            </Typography>
            <Autocomplete
                getOptionLabel={(option) => option.name}
                filterOptions={(x) => x}
                options={options}
                autoComplete
                includeInputInList
                filterSelectedOptions
                value={value}
                onChange={(
                    event,
                    newValue: SpotifyApi.ArtistObjectFull | null
                ) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select an artist"
                        variant="filled"
                        fullWidth
                        sx={{
                            minWidth: {
                                xs: "95vw",
                                md: "45vw",
                            },
                        }}
                    />
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props}>
                            <Grid container alignItems="center">
                                <Grid item sx={{ mr: 1 }}>
                                    <Avatar
                                        variant="square"
                                        src={option.images[0]?.url}
                                        alt={option.name}
                                    />
                                </Grid>
                                <Grid item xs>
                                    {option.name}
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ fontWeight: 300 }}
                                    >
                                        {option.followers.total.toLocaleString()}{" "}
                                        followers
                                    </Typography>
                                </Grid>
                            </Grid>
                        </li>
                    );
                }}
            />
        </>
    );
};

export default withSection(ArtistsSection);
