import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface IAuthenticationContext {
    token?: string;
    login: () => void;
}

const AuthenticationContext = createContext<IAuthenticationContext>(
    {} as IAuthenticationContext
);

interface Props {
    children: ReactNode;
}

export const AuthenticationProvider = ({ children }: Props) => {
    const [token, setToken] = useState<string>();

    const login = useCallback(async () => {
        const params = new URLSearchParams({
            response_type: "token",
            client_id: process.env.REACT_APP_CLIENT_ID as string,
            scope: "playlist-modify-public playlist-modify-private",
            redirect_uri: process.env.REACT_APP_URL as string,
        });
        window.location.replace(
            `https://accounts.spotify.com/authorize?${params.toString()}`
        );
    }, []);

    useEffect(() => {
        if (!token) {
            const hash = window.location.hash.substring(1);
            const paramsToken = new URL(
                `https://majoritify.web.app/?${hash}`
            ).searchParams.get("access_token");

            if (paramsToken) {
                setToken(paramsToken);
                window.history.replaceState(null, "", window.location.pathname); // ? Clear query strings after token is acquired
            }
        }
    }, [token]);

    return (
        <AuthenticationContext.Provider value={{ token, login }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

export const useAuthentication = () => useContext(AuthenticationContext);
