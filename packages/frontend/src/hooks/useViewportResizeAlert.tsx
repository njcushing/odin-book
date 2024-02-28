import { useState, useEffect } from "react";

function useViewportResizeAlert(callback: (size: { width: number; height: number }) => unknown) {
    const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function resizeAlert() {
            const size = {
                width: window.innerWidth,
                height: window.innerHeight,
            };
            callback(size);
            setViewportSize(size);
        }

        window.addEventListener("resize", resizeAlert);

        return () => {
            window.removeEventListener("resize", resizeAlert);
        };
    }, [callback]);

    return viewportSize;
}

export default useViewportResizeAlert;
