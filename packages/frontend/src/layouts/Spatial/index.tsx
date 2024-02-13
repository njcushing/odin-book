import { useState, useEffect, useRef } from "react";
import PropTypes, { InferProps } from "prop-types";
import * as extendedPropTypes from "@/utils/extendedPropTypes";
import styles from "./index.module.css";

function Spatial({ width, height, arrangements }: InferProps<typeof Spatial.propTypes>) {
    const [layout, setLayout] = useState(null);
    const [content, setContent] = useState(null);

    const wrapperRef = useRef(null);

    useEffect(() => {
        let wrapperRefCurrent: Element;
        const observer = new ResizeObserver((entries) => {
            // Find first matching layout from 'layouts' prop, otherwise null
            if (arrangements) {
                for (let i = 0; i < arrangements.length; i++) {
                    if (
                        entries[0].contentRect.width >= arrangements[i].minWidth &&
                        entries[0].contentRect.height >= arrangements[i].minHeight &&
                        entries[0].contentRect.width <= arrangements[i].maxWidth &&
                        entries[0].contentRect.height <= arrangements[i].maxHeight
                    ) {
                        setLayout(arrangements[i]);
                        return;
                    }
                }
            }
            setLayout(null);
        });
        if (wrapperRef.current) {
            wrapperRefCurrent = wrapperRef.current;
            observer.observe(wrapperRef.current);
        }
        return () => {
            if (wrapperRefCurrent instanceof Element) observer.unobserve(wrapperRefCurrent);
        };
    }, [arrangements]);

    useEffect(() => {
        let contentNew = null;
        const areas = [];
        const areaSizes = [];
        const gridTemplate = {
            gridTemplateRows: "",
            gridTemplateColumns: "",
        };
        const alignments = {
            justifySelf: "center",
            alignSelf: "center",
        };
        if (layout) {
            for (let i = 0; i < layout.areas.length; i++) {
                const area = layout.areas[i];
                areas.push(
                    <div
                        className={styles["spatial-zone"]}
                        style={{
                            gridArea: `${layout.type === "rows" ? `${i + 1} / 1 / ${i + 2} / -1` : `1 / ${i + 1} / -1 / ${i + 2}`}`,
                        }}
                    >
                        {area.children}
                    </div>,
                );
                areaSizes.push(area.size);
            }
            if (layout.type === "rows") gridTemplate.gridTemplateRows = areaSizes.join(" ");
            if (layout.type === "columns") gridTemplate.gridTemplateColumns = areaSizes.join(" ");
            alignments.justifySelf = layout.justifySelf;
            alignments.alignSelf = layout.alignSelf;
        }
        contentNew = (
            <div
                className={styles["container"]}
                style={{
                    display: "grid",
                    ...gridTemplate,
                    ...alignments,

                    width,
                    height,
                }}
            >
                {areas}
            </div>
        );
        setContent(contentNew);
    }, [layout]);

    return (
        <div
            className={styles["wrapper"]}
            style={{
                width,
                height,
            }}
            ref={wrapperRef}
        >
            {content}
        </div>
    );
}

Spatial.propTypes = {
    width: extendedPropTypes.cssSizeRequired,
    height: extendedPropTypes.cssSizeRequired,
    arrangements: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.oneOf(["rows", "columns"]),
            width: extendedPropTypes.cssSizeRequired,
            minWidth: extendedPropTypes.integerRequired,
            maxWidth: extendedPropTypes.integerRequired,
            height: extendedPropTypes.cssSizeRequired,
            minHeight: extendedPropTypes.integerRequired,
            maxHeight: extendedPropTypes.integerRequired,
            areas: PropTypes.arrayOf(
                PropTypes.shape({
                    size: extendedPropTypes.cssSizeRequired,
                    children: PropTypes.arrayOf(PropTypes.element),
                }),
            ),
            justifySelf: PropTypes.oneOf([
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
            ]),
            alignSelf: PropTypes.oneOf([
                "flex-start",
                "center",
                "flex-end",
                "space-between",
                "space-around",
                "space-evenly",
            ]),
        }),
    ),
};

Spatial.defaultProps = {
    arrangements: [],
};

export default Spatial;
