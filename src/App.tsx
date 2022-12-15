import ReactFullpage from "@fullpage/react-fullpage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LogoutOverlay from "./components/common/LogoutOverlay";
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
                licenseKey=""
                cards={false}
                cardsOptions={{
                    perspective: 100,
                    fadeContent: true,
                    fadeBackground: true,
                }}
                normalScrollElements=".MuiAutocomplete-popper, .MuiPaper-root"
                render={(renderProps) => {
                    if (renderProps.state.initialized) {
                        renderProps.fullpageApi.setAllowScrolling(false);
                        renderProps.fullpageApi.setKeyboardScrolling(false);
                    }

                    return (
                        <div id="fullpage-wrapper">
                            <FormProvider>
                                <LandingSection {...renderProps} order={0} />
                                <ArtistsSection {...renderProps} order={1} />
                                <AlbumsSection {...renderProps} order={2} />
                                <ResultSection {...renderProps} order={3} />
                            </FormProvider>
                        </div>
                    );
                }}
            />
            <LogoutOverlay />
        </ThemeProvider>
    );
}

export default App;
