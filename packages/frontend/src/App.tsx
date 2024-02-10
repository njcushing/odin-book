import Router from "@/routes";
import LayoutMain from "@/layouts/main";

function App() {
    return (
        <div
            className="app"
            style={{
                placeContent: "center",
                textAlign: "center",
            }}
        >
            <LayoutMain />
            <Router />
        </div>
    );
}

export default App;
