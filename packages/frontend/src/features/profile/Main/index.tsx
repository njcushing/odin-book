import { useParams, Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import Navigation from "@/features/navigation";
import * as mockData from "@/mockData";
import Profile from "..";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: (
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={mockData.posts(10, "summary")}
                scrollable
                listStyles={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: "0.4rem",
                    width: "calc(100% - (2 * 0.4rem))",
                    height: "auto",
                    padding: "0.4rem",
                    margin: "0rem",
                }}
            />
        ),
        errorElement: <div></div>,
    },
    {
        path: "replies",
        element: <div></div>,
        errorElement: <div></div>,
    },
    {
        path: "likes",
        element: <div></div>,
        errorElement: <div></div>,
    },
    {
        path: "followers",
        element: <div></div>,
        errorElement: <div></div>,
    },
    {
        path: "following",
        element: <div></div>,
        errorElement: <div></div>,
    },
];

function Main() {
    const { accountTag } = useParams();

    const navigation = (
        <div className={styles["navigation-container"]} key={0}>
            <Navigation.Horizontal
                options={[
                    { text: "Posts", link: "" },
                    { text: "Replies", link: "replies" },
                    { text: "Likes", link: "likes" },
                    { text: "Followers", link: "followers" },
                    { text: "Following", link: "following" },
                ]}
                selected="Posts"
            />
        </div>
    );

    return (
        <div className={styles["container"]}>
            <LayoutUI.Spatial
                width="100%"
                height="100%"
                arrangements={[
                    {
                        type: "rows",
                        minWidth: 0,
                        maxWidth: 999999,
                        minHeight: 0,
                        maxHeight: 999999,
                        areas: [
                            { size: "auto", children: [<Profile.Summary key={0} />] },
                            { size: "auto", children: [navigation] },
                            { size: "1fr", children: [<Outlet key={0} />] },
                        ],
                        style: {
                            justifySelf: "flex-start",
                            alignSelf: "center",
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

export default Main;
