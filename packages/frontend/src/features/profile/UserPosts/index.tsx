import { useState, useEffect, useContext } from "react";
import * as useAsync from "@/hooks/useAsync";
import * as extendedTypes from "@shared/utils/extendedTypes";
import { ProfileContext } from "@/features/profile/Main";
import Posts from "@/features/posts";
import getUserPosts, { Params, Response } from "./utils/getUserPosts";

function UserPosts() {
    const { _id } = useContext(ProfileContext);

    const [userId, setUserId] = useState<extendedTypes.MongoDBObjectId | null | undefined>(_id);
    const [posts, setPosts] = useState<Response>([]);
    const [response, setParams, setAttempting] = useAsync.GET<Params, Response>(
        {
            func: getUserPosts,
            parameters: [{ params: { userId: _id, after: null } }, null],
        },
        true,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const newState = response ? response.data : [];
        setPosts(newState || []);
    }, [response]);

    useEffect(() => {
        setAttempting(true);
    }, [userId, setAttempting]);

    if (response && response.status === 401) window.location.assign("/");

    useEffect(() => {
        if (response && response.status >= 400 && response.message && response.message.length > 0) {
            setErrorMessage(response.message);
        }
    }, [response]);

    return posts
        ? posts.map((post) => {
              return <Posts.Post _id={post._id} key={`post-self-${post._id}`} />;
          })
        : null;
}

export default UserPosts;
