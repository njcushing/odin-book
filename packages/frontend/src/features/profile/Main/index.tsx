import { useParams, useLocation, Outlet } from "react-router-dom";
import LayoutUI from "@/layouts";
import Navigation from "@/components/navigation";
import User from "@/components/user";
import * as mockData from "@/mockData";
import Posts from "@/features/posts";
import Profile from "..";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: ["1", "2", "3", "4", "5"].map((_id) => {
            return <Posts.Post _id={_id} key={`post-self-${_id}`} />;
        }),
        errorElement: <div></div>,
    },
    {
        path: "replies",
        element: ["1", "2", "3", "4", "5"].map((_id) => {
            return (
                <Posts.Post
                    _id={_id}
                    overrideReplies={["6"]}
                    viewingDefault="replies"
                    key={`reply-self-${_id}`}
                />
            );
        }),
        errorElement: <div></div>,
    },
    {
        path: "likes",
        element: ["1", "2", "3", "4", "5"].map((_id) => {
            return <Posts.Post _id={_id} key={`post-liked-${_id}`} />;
        }),
        errorElement: <div></div>,
    },
    {
        path: "followers",
        element: mockData.getUsers(10).map((user) => {
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
        element: mockData.getUsers(10).map((user) => {
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
        <div className={styles["navigation-container"]} key={1}>
            <Navigation.Horizontal options={navigationOptions} selected={selected} />
        </div>
    );

    return (
        <div className={styles["container"]}>
            <LayoutUI.List
                label="navigation"
                ordered={false}
                listItems={[<Profile.Summary key={0} />, navigation, <Outlet key={2} />]}
                scrollable
                listStyles={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: "100%",
                    height: "auto",
                    gap: "0px",
                }}
                key={0}
            />
        </div>
    );
}

export default Main;
