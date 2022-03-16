import { createContext, ReactNode, useContext, useState } from "react";

interface IFormContext {
    artist: SpotifyApi.ArtistObjectFull | null;
    setArtist: (artist: SpotifyApi.ArtistObjectFull) => void;
    albums: SpotifyApi.AlbumObjectFull[];
    setAlbums: (albums: SpotifyApi.AlbumObjectFull[]) => void;
}

const FormContext = createContext<IFormContext>({} as IFormContext);

export const FormProvider = ({ children }: { children: ReactNode }) => {
    const [artist, setArtist] = useState<SpotifyApi.ArtistObjectFull | null>(
        null
    );
    const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectFull[]>([]);

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