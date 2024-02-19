import React, { useState, useEffect, useRef } from "react";
import { ClientRequest } from "http";
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
    }, [width, height, arrangements]);

    useEffect(() => {
        if (layout) {
            let contentNew = null;
            const areas = [];
            const areaSizes = [];
            const gridTemplate = {
                gridTemplateRows: "",
                gridTemplateColumns: "",
            };
            for (let i = 0; i < layout.areas.length; i++) {
                const area = layout.areas[i];
                areas.push(
                    <div
                        className={styles["spatial-zone"]}
                        style={{
                            gridArea: `${layout.type === "rows" ? `${i + 1} / 1 / ${i + 2} / -1` : `1 / ${i + 1} / -1 / ${i + 2}`}`,
                        }}
                        key={i}
                    >
                        {area.children}
                    </div>,
                );
                areaSizes.push(area.size);
            }
            if (layout.type === "rows") gridTemplate.gridTemplateRows = areaSizes.join(" ");
            if (layout.type === "columns") gridTemplate.gridTemplateColumns = areaSizes.join(" ");
            contentNew = (
                <div
                    className={styles["container"]}
                    style={{
                        ...layout.style,
                        display: "grid",
                        ...gridTemplate,
                    }}
                >
                    {areas}
                </div>
            );
            setContent(contentNew);
        } else setContent(null);
    }, [width, height, layout]);

    return (
        <div
            className={styles["wrapper"]}
            style={{
                width,
                height,
                maxWidth: width,
                maxHeight: height,
            }}
            ref={wrapperRef}
        >
            {content}
        </div>
    );
}

export default Spatial;
