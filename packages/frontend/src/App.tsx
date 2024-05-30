import { createContext, useEffect, useMemo } from "react";
import Router from "@/routes";
import { saveTheme, loadTheme } from "./themes";
import useScrollableElement from "./hooks/useScrollableElement";

interface AppState {
    isScrollable: boolean;
}

const defaultState: AppState = {
    isScrollable: false,
};

export const AppContext = createContext<AppState>(defaultState);

function App() {
    const { isScrollable, current, refCallback } = useScrollableElement({
        atTopCallback: () => PubSub.publish("page-scroll-reached-top"),
        atBottomCallback: () => PubSub.publish("page-scroll-reached-bottom"),
        isInverted: false,
        onlyCallbackOnCorrectDirectionalScroll: true,
    });

    // publish whether page is scrollable
    useEffect(() => {
        PubSub.publish("page-scrollable", isScrollable);
    }, [isScrollable]);

    // subscribe to relevant scroll topics
    useEffect(() => {
        PubSub.unsubscribe("page-scrollable-area-shift-up");
        PubSub.subscribe("page-scrollable-area-shift-up", (msg, data) => {
            if (current) current.scrollTop -= data;
        });
        PubSub.unsubscribe("page-scrollable-area-shift-down");
        PubSub.subscribe("page-scrollable-area-shift-down", (msg, data) => {
            if (current) current.scrollTop += data;
        });

        return () => {
            PubSub.unsubscribe("page-scrollable-area-shift-up");
            PubSub.unsubscribe("page-scrollable-area-shift-down");
        };
    }, [current]);

    // load theme
    if (localStorage.getItem("odin-book-theme") === null) saveTheme("default");
    loadTheme();

    // calculate vw and vh units
    useEffect(() => {
        const setUnits = () => {
            const vw = window.innerWidth * 0.01;
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vw", `${vw}px`);
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        };

        setUnits();
        window.addEventListener("resize", setUnits);

        return () => {
            window.removeEventListener("resize", setUnits);
        };
    }, []);

    return (
        <AppContext.Provider value={useMemo(() => ({ isScrollable }), [isScrollable])} key={0}>
            <div
                className="app"
                style={{
                    placeContent: "center",
                    textAlign: "center",
                }}
                ref={refCallback}
            >
                <Router />
            </div>
        </AppContext.Provider>
    );
}

export default App;
