import { createContext, useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Outlet } from "react-router-dom";
import Navigation from "@/components/navigation";
import Accessibility from "@/components/accessibility";
import * as useAsync from "@/hooks/useAsync";
import mongoose from "mongoose";
import getIdFromTag, { Params, Response } from "@/utils/getIdFromTag";
import { v4 as uuidv4 } from "uuid";
import Profile from "..";
import UserPosts from "../UserPosts";
import UserLikes from "../UserLikes";
import UserFollowers from "../UserFollowers";
import UserFollowing from "../UserFollowing";
import styles from "./index.module.css";

// I have to use keys for the "" and "replies" routes to force a rerender of the UserPosts component

export const routes = [
    {
        path: "",
        element: <UserPosts key="user-posts" />,
        errorElement: <div></div>,
    },
    {
        path: "replies",
        element: <UserPosts repliesOnly key="user-replies" />,
        errorElement: <div></div>,
    },
    {
        path: "likes",
        element: <UserLikes />,
        errorElement: <div></div>,
    },
    {
        path: "followers",
        element: <UserFollowers />,
        errorElement: <div></div>,
    },
    {
        path: "following",
        element: <UserFollowing />,
        errorElement: <div></div>,
    },
];

interface ProfileState {
    _id?: mongoose.Types.ObjectId | null | undefined;
    awaitingResponse: boolean;
}

const defaultState: ProfileState = {
    _id: null,
    awaitingResponse: true,
};

export const ProfileContext = createContext<ProfileState>(defaultState);

function Main() {
    const { accountTag } = useParams();

    const [waiting, setWaiting] = useState<boolean>(true);

    const [state, setState] = useState<mongoose.Types.ObjectId | null | undefined>(null);
    const [response, setParams, setAttempting, gettingIdFromTag] = useAsync.GET<Params, Response>(
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

    useEffect(() => {
        setWaiting(gettingIdFromTag);
    }, [gettingIdFromTag]);

    // reset component on URL route change
    const [generateKey, setGenerateKey] = useState<string>(uuidv4());
    useEffect(() => {
        setGenerateKey(uuidv4());
        setState(null);
        setAttempting(true);
        setParams([{ params: { accountTag: accountTag || "" } }, null]);
    }, [accountTag, setAttempting, setParams]);

    useEffect(() => {
        const publish = () => {
            PubSub.publish("infobar-set-choices", [
                "RecommendedUsers",
                "RecentPosts",
                "RecentChatActivity",
            ]);
        };

        PubSub.subscribe("infobar-ready", () => publish());
        publish();

        return () => {
            PubSub.unsubscribe("infobar-ready");
        };
    }, []);

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
            <div className={styles["container"]} key={generateKey}>
                {!waiting ? (
                    <>
                        <Profile.Summary key={0} />
                        {navigation}
                        <Outlet key={2} />
                    </>
                ) : (
                    <Accessibility.WaitingWheel />
                )}
            </div>
        </ProfileContext.Provider>
    );
}

export default Main;
