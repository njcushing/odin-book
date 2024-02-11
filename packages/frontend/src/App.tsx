import Router from "@/routes";
import LayoutUI from "@/layouts";

function App() {
    return (
        <div
            className="app"
            style={{
                placeContent: "center",
                textAlign: "center",
            }}
        >
            <LayoutUI.Main
                mainPanelElement={
                    <LayoutUI.List
                        label="test list"
                        listItems={[]}
                        listStyles={{
                            flexDirection: "column",
                            gap: "6px",
                            width: "100%",
                            height: "auto",
                            padding: "6px",
                            margin: "0px",
                        }}
                    />
                }
            />
            <Router />
        </div>
    );
}

export default App;
