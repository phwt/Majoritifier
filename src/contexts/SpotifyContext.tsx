import { createContext, ReactNode, useContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyInstance = new SpotifyWebApi();

const SpotifyContext =
    createContext<SpotifyWebApi.SpotifyWebApiJs>(spotifyInstance);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => (
    <SpotifyContext.Provider value={spotifyInstance}>
        {children}
    </SpotifyContext.Provider>
);

export const useSpotify = () => useContext(SpotifyContext);
