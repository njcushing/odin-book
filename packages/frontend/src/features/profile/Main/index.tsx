import { useParams, useLocation, Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import Navigation from "@/features/navigation";
import User from "@/components/user";
import * as mockData from "@/mockData";
import Profile from "..";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: mockData.posts(10, "summary"),
        errorElement: <div></div>,
    },
    {
        path: "replies",
        element: <div></div>,
        errorElement: <div></div>,
    },
    {
        path: "likes",
        element: mockData.posts(10, "summary"),
        errorElement: <div></div>,
    },
    {
        path: "followers",
        element: mockData.users(10).map((user) => {
            return (
                <User.Option
                    user={{
                        image: {
                            src: user.preferences.profileImage.src,
                            alt: user.preferences.profileImage.alt,
                            status: user.status,
                        },
                        displayName: user.preferences.displayName,
                        accountTag: user.accountTag,
                        size: "s",
                    }}
                    following={Math.random() < 0.5}
                    key={user._id}
                />
            );
        }),
        errorElement: <div></div>,
    },
    {
        path: "following",
        element: mockData.users(10).map((user) => {
            return (
                <User.Option
                    user={{
                        image: {
                            src: user.preferences.profileImage.src,
                            alt: user.preferences.profileImage.alt,
                            status: user.status,
                        },
                        displayName: user.preferences.displayName,
                        accountTag: user.accountTag,
                        size: "s",
                    }}
                    following
                    key={user._id}
                />
            );
        }),
        errorElement: <div></div>,
    },
];

function Main() {
    const { accountTag } = useParams();

    const location = useLocation();
    const path = location.pathname.split("/");

    const navigationOptions = [
        { text: "Posts", link: "" },
        { text: "Replies", link: "replies" },
        { text: "Likes", link: "likes" },
        { text: "Followers", link: "followers" },
        { text: "Following", link: "following" },
    ];
    let selected = "Posts";
    if (path[path.length - 1] === "replies") selected = "Replies";
    if (path[path.length - 1] === "likes") selected = "Likes";
    if (path[path.length - 1] === "followers") selected = "Followers";
    if (path[path.length - 1] === "following") selected = "Following";

    const navigation = (
        <div className={styles["navigation-container"]} key={0}>
            <Navigation.Horizontal options={navigationOptions} selected={selected} />
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
                            {
                                size: "1fr",
                                children: [
                                    <LayoutUI.List
                                        label="navigation"
                                        ordered={false}
                                        listItems={[<Outlet key={0} />]}
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
                                        key={0}
                                    />,
                                ],
                            },
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
