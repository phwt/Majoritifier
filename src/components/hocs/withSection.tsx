import { Box } from "@mui/material";
import { fullpageApi } from "@fullpage/react-fullpage";

export interface ISectionProps {
    state: object;
    fullpageApi: fullpageApi;
    order: number;
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
                <Box
                    sx={{
                        zIndex: 100 - props.order, // ? Sometimes there are overlapped elements from the lower section
                    }}
                >
                    <Component {...props} />
                </Box>
            </Box>
        </div>
    );
    wrappedComponent.displayName = "withSection";
    return wrappedComponent;
};

export default withSection;
