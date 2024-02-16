import LayoutUI from "@/layouts";
import PeopleYouMayKnow from "../PeopleYouMayKnow";
import styles from "./index.module.css";

function Home() {
    return (
        <div className={styles["wrapper"]}>
            <LayoutUI.Spatial
                width="100%"
                height="100%"
                arrangements={[
                    {
                        type: "rows",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 820,
                        maxHeight: 999999,
                        areas: [
                            { size: "auto", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "auto", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "auto", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "1fr", children: [] },
                        ],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "flex-start",
                            gap: "10px",
                            width: "100%",
                            height: "100%",
                            padding: "0rem",
                        },
                    },
                    {
                        type: "rows",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 544,
                        maxHeight: 820,
                        areas: [
                            { size: "auto", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "auto", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "1fr", children: [] },
                        ],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "flex-start",
                            gap: "10px",
                            width: "100%",
                            height: "100%",
                            padding: "0rem",
                        },
                    },
                    {
                        type: "rows",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 0,
                        maxHeight: 544,
                        areas: [
                            { size: "auto", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "1fr", children: [] },
                        ],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "flex-start",
                            gap: "10px",
                            width: "100%",
                            height: "100%",
                            padding: "0rem",
                        },
                    },
                ]}
            />
        </div>
    );
}

export default Home;
