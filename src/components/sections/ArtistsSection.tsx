import {
    Typography,
    Autocomplete,
    TextField,
    Grid,
    Avatar,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ReactVisibilitySensor from "react-visibility-sensor";
import { useForm } from "../../contexts/FormContext";
import { useSpotify } from "../../contexts/SpotifyContext";
import useFocus from "../../hooks/useFocus";
import SecondaryTypography from "../common/SecondaryTypography";
import withSection, { ISectionProps } from "../hocs/withSection";

const ArtistsSection = ({ fullpageApi }: ISectionProps) => {
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

    const [inputRef, setInputFocus] = useFocus();
    const handleVisibilityChange = useCallback((isVisible: boolean) => {
        if (isVisible) setInputFocus();
    }, []);

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
                    <ReactVisibilitySensor onChange={handleVisibilityChange}>
                        <TextField
                            {...params}
                            inputRef={inputRef}
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
                    </ReactVisibilitySensor>
                )}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id}>
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
                                    <SecondaryTypography>
                                        {option.followers.total.toLocaleString()}{" "}
                                        followers
                                    </SecondaryTypography>
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
