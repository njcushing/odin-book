import Router from "@/routes";

function App() {
    return (
        <div
            className="app"
            style={{
                placeContent: "center",
                textAlign: "center",
            }}
        >
            <Router />

            <h1 style={{ fontSize: "4rem" }}>Welcome!</h1>
            <div style={{ height: "2rem" }}></div>
            <h2 style={{ fontSize: "2.4rem" }}>
                This is a template project that uses React, TypeScript, Vite, ESLint and Prettier.
            </h2>
            <div style={{ height: "3rem" }}></div>
            <h3 style={{ fontSize: "1.8rem" }}>
                Feel free to delete this content in the src/App.tsx component to get started.
            </h3>
        </div>
    );
}

export default App;
