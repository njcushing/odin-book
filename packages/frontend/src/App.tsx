import { useEffect } from "react";
import Router from "@/routes";
import { saveTheme, loadTheme } from "./themes";
import useScrollableElement from "./hooks/useScrollableElement";

function App() {
    const { current, refCallback } = useScrollableElement({
        atTopCallback: () => PubSub.publish("page-scroll-reached-top"),
        atBottomCallback: () => PubSub.publish("page-scroll-reached-bottom"),
        isInverted: false,
        onlyCallbackOnCorrectDirectionalScroll: true,
    });

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

    return (
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
    );
}

export default App;
