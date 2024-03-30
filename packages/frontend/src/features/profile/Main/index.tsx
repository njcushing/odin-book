import { createContext, useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Outlet } from "react-router-dom";
import Navigation from "@/components/navigation";
import User from "@/components/user";
import * as mockData from "@/mockData";
import * as extendedTypes from "@shared/utils/extendedTypes";
import * as useAsync from "@/hooks/useAsync";
import Posts from "@/features/posts";
import getIdFromTag, { Params, Response } from "@/utils/getIdFromTag";
import Profile from "..";
import UserPosts from "../UserPosts";
import styles from "./index.module.css";

export const routes = [
    {
        path: "",
        element: <UserPosts />,
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

interface ProfileState {
    _id?: extendedTypes.MongoDBObjectId | null;
    awaitingResponse: boolean;
}

const defaultState: ProfileState = {
    _id: null,
    awaitingResponse: true,
};

export const ProfileContext = createContext<ProfileState>(defaultState);

function Main() {
    const { accountTag } = useParams();

    const [state, setState] = useState<extendedTypes.MongoDBObjectId | null>(null);
    const [response] = useAsync.GET<Params, Response>(
        { func: getIdFromTag, parameters: [{ params: { accountTag: accountTag || "" } }, null] },
        true,
    );
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(
        defaultState.awaitingResponse,
    );

    useEffect(() => {
        const newState = response ? response.data : null;
        setState(newState || null);
        setAwaitingResponse(false);
    }, [response]);

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
        <ProfileContext.Provider
            value={useMemo(() => ({ _id: state, awaitingResponse }), [state, awaitingResponse])}
        >
            <div className={styles["container"]}>
                <Profile.Summary key={0} />
                {navigation}
                <Outlet key={2} />
            </div>
        </ProfileContext.Provider>
    );
}

export default Main;
