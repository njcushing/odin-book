import { useRef } from "react";
import Router from "@/routes";
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
