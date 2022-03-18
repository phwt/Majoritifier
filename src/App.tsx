import ReactFullpage from "@fullpage/react-fullpage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AlbumsSection from "./components/sections/AlbumsSection";
import ArtistsSection from "./components/sections/ArtistsSection";
import LandingSection from "./components/sections/LandingSection";
import ResultSection from "./components/sections/ResultSection";
import { FormProvider } from "./contexts/FormContext";

function App() {
    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: { main: "#1DB954" },
            secondary: { main: "#FFFFFF", dark: "#FFFFFF" },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 100,
                        paddingLeft: "2em",
                        paddingRight: "2em",
                    },
                    contained: {
                        color: "#FFFFFF",
                    },
                    outlined: {
                        borderWidth: 2,
                        ":hover": {
                            borderWidth: 2,
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <ReactFullpage
                licenseKey="" // TODO: Submit request for license key
                cards={false}
                cardsOptions={{
                    perspective: 100,
                    fadeContent: true,
                    fadeBackground: true,
                }}
                normalScrollElements=".MuiList-padding, .MuiAutocomplete-popper"
                render={(renderProps) => {
                    if (renderProps.state.initialized) {
                        renderProps.fullpageApi.setAllowScrolling(false);
                        renderProps.fullpageApi.setKeyboardScrolling(false);
                    }

                    return (
                        <div id="fullpage-wrapper">
                            <FormProvider>
                                <LandingSection {...renderProps} />
                                <ArtistsSection {...renderProps} />
                                <AlbumsSection {...renderProps} />
                                <ResultSection {...renderProps} />
                            </FormProvider>
                        </div>
                    );
                }}
            />
        </ThemeProvider>
    );
}

export default App;
