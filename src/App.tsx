import ReactFullpage from "@fullpage/react-fullpage";
import AlbumsSection from "./components/sections/AlbumsSection";
import ArtistsSection from "./components/sections/ArtistsSection";
import LandingSection from "./components/sections/LandingSection";
import ResultSection from "./components/sections/ResultSection";

function App() {
    return (
        <ReactFullpage
            licenseKey="" // TODO: Submit request for license key
            cards={false}
            cardsOptions={{
                perspective: 100,
                fadeContent: true,
                fadeBackground: true,
            }}
            render={(renderProps) => {
                if (renderProps.state.initialized) {
                    renderProps.fullpageApi.setAllowScrolling(false);
                    renderProps.fullpageApi.setKeyboardScrolling(false);
                }

                return (
                    <div id="fullpage-wrapper">
                        <LandingSection {...renderProps} />
                        <ArtistsSection {...renderProps} />
                        <AlbumsSection {...renderProps} />
                        <ResultSection {...renderProps} />
                    </div>
                );
            }}
        />
    );
}

export default App;
