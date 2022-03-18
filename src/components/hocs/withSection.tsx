import { Box } from "@mui/material";
import { fullpageApi } from "@fullpage/react-fullpage";

export interface ISectionProps {
    state: object;
    fullpageApi: fullpageApi;
}

const withSection = (Component: React.ComponentType<ISectionProps>) => {
    const wrappedComponent = (props: ISectionProps) => (
        <div className="section">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <div>
                    <Component {...props} />
                </div>
            </Box>
        </div>
    );
    wrappedComponent.displayName = "withSection";
    return wrappedComponent;
};

export default withSection;
