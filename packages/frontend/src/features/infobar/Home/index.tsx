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
                        minHeight: 900,
                        maxHeight: 999999,
                        areas: [
                            { size: "1fr", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "1fr", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "1fr", children: [<PeopleYouMayKnow key={0} />] },
                        ],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "flex-start",
                            width: "100%",
                            height: "100%",
                            padding: "0rem",
                        },
                    },
                    {
                        type: "rows",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 600,
                        maxHeight: 900,
                        areas: [
                            { size: "1fr", children: [<PeopleYouMayKnow key={0} />] },
                            { size: "1fr", children: [<PeopleYouMayKnow key={0} />] },
                        ],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "flex-start",
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
                        maxHeight: 600,
                        areas: [{ size: "1fr", children: [<PeopleYouMayKnow key={0} />] }],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "flex-start",
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
