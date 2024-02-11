import { useState, useEffect, useRef } from "react";
import PropTypes, { InferProps } from "prop-types";
import styles from "./index.module.css";

function Main({
    navigationPanelElement,
    mainPanelElement,
    otherContentPanelElement,
}: InferProps<typeof Main.propTypes>) {
    const [layout, setLayout] = useState("wide");

    const wrapperRef = useRef(null);

    useEffect(() => {
        let wrapperRefCurrent: Element;
        const observer = new ResizeObserver((entries) => {
            /*
             *  Magic numbers here for the container queries is annoying; ideally I want to use CSS
             *  vars, but there is no specification for this. Since we have set our max page width
             *  at 1440px, for now I have just hard-coded two-thirds and one-third as the
             *  'swap-points' between the different horizontal layouts. If container queries allow
             *  CSS vars in future, I will put this functionality in the CSS file.
             */

            if (entries[0].contentRect.width > 960) setLayout("wide");
            else if (entries[0].contentRect.width > 480) setLayout("slim");
            else setLayout("thin");
        });
        if (wrapperRef.current) {
            wrapperRefCurrent = wrapperRef.current;
            observer.observe(wrapperRef.current);
        }
        return () => {
            if (wrapperRefCurrent instanceof Element) observer.unobserve(wrapperRefCurrent);
        };
    }, []);

    const navigationPanel = (
        <div className={styles["navigation-panel"]}>{navigationPanelElement}</div>
    );
    const mainPanel = <div className={styles["main-panel"]}>{mainPanelElement}</div>;
    const otherContentPanel = (
        <div className={styles["other-content-panel"]}>{otherContentPanelElement}</div>
    );

    let content = null;
    switch (layout) {
        case "wide":
            content = (
                <>
                    {navigationPanel}
                    {mainPanel}
                    {otherContentPanel}
                </>
            );
            break;
        case "slim":
        case "thin":
            content = (
                <>
                    {navigationPanel}
                    {mainPanel}
                </>
            );
            break;
        default:
    }

    return (
        <div className={styles["wrapper"]} ref={wrapperRef}>
            <div className={styles["container"]} data-layout={layout}>
                {content}
            </div>
        </div>
    );
}

Main.propTypes = {
    navigationPanelElement: PropTypes.element,
    mainPanelElement: PropTypes.element,
    otherContentPanelElement: PropTypes.element,
};

export default Main;
