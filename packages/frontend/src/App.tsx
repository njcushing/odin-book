import { useEffect, useRef } from "react";
import Router from "@/routes";
import { saveTheme, loadTheme } from "./themes";
import useScrollableElement from "./hooks/useScrollableElement";

function App() {
    const scrollableWrapperRef = useRef<HTMLDivElement>(null);
    useScrollableElement({
        ref: scrollableWrapperRef,
        atTopCallback: () => PubSub.publish("page-scroll-reached-top"),
        atBottomCallback: () => PubSub.publish("page-scroll-reached-bottom"),
        isInverted: false,
        onlyCallbackOnCorrectDirectionalScroll: true,
    });

    // subscribe to relevant scroll topics
    useEffect(() => {
        PubSub.unsubscribe("page-scrollable-area-shift-up");
        PubSub.subscribe("page-scrollable-area-shift-up", (msg, data) => {
            if (scrollableWrapperRef.current) scrollableWrapperRef.current.scrollTop -= data;
        });
        PubSub.unsubscribe("page-scrollable-area-shift-down");
        PubSub.subscribe("page-scrollable-area-shift-down", (msg, data) => {
            if (scrollableWrapperRef.current) scrollableWrapperRef.current.scrollTop += data;
        });

        return () => {
            PubSub.unsubscribe("page-scrollable-area-shift-up");
            PubSub.unsubscribe("page-scrollable-area-shift-down");
        };
    }, []);

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
            ref={scrollableWrapperRef}
        >
            <Router />
        </div>
    );
}

export default App;
