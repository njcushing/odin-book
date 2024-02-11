import Router from "@/routes";
import LayoutMain from "@/layouts/LayoutMain";
import LayoutList from "@/layouts/LayoutList";

function App() {
    return (
        <div
            className="app"
            style={{
                placeContent: "center",
                textAlign: "center",
            }}
        >
            <LayoutMain
                mainPanelElement={
                    <LayoutList
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
