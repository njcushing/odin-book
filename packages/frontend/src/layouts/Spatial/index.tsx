import React, { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";

type Arrangement = {
    type: "rows" | "columns";
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    areas: [
        {
            size: string;
            children: React.ReactNode[];
        },
    ];
    style: React.CSSProperties;
};

type SpatialProps = {
    width?: string;
    height?: string;
    arrangements: Arrangement[];
};

function Spatial({ width = "auto", height = "auto", arrangements }: SpatialProps) {
    const [layout, setLayout] = useState<Arrangement | null>(null);
    const [content, setContent] = useState<React.ReactNode | null>(null);

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
        let additionalStyles = {};
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
            additionalStyles = { ...layout.style };
        }
        contentNew = (
            <div
                className={styles["container"]}
                style={{
                    ...additionalStyles,
                    display: "grid",
                    ...gridTemplate,
                }}
            >
                {areas}
            </div>
        );
        setContent(contentNew);
    }, [width, height, layout]);

    return (
        <div className={styles["wrapper"]} ref={wrapperRef}>
            {content}
        </div>
    );
}

export default Spatial;
