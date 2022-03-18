import { createContext, ReactNode, useContext, useState } from "react";
import { AlbumObjectResponse } from "../models/AlbumObjectResponse";

interface IFormContext {
    artist: SpotifyApi.ArtistObjectFull | null;
    setArtist: (artist: SpotifyApi.ArtistObjectFull) => void;
    albums: AlbumObjectResponse[];
    setAlbums: (albums: AlbumObjectResponse[]) => void;
}

const FormContext = createContext<IFormContext>({} as IFormContext);

export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [artist, setArtist] = useState<SpotifyApi.ArtistObjectFull | null>(
        null
    );
    const [albums, setAlbums] = useState<AlbumObjectResponse[]>([]);

    return (
        <FormContext.Provider
            value={{
                artist,
                setArtist,
                albums,
                setAlbums,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export const useForm = () => useContext(FormContext);
