import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import * as useAsync from "@/hooks/useAsync";
import getActiveUser from "./utils/getActiveUser";

export interface UserTypes {
    _id?: string;
    accountTag?: string;
    githubId?: string;
    email?: string;
    password?: string;
    admin?: boolean;
    following?: { users: string[]; requests: string[] };
    followers?: { users: string[]; requests: string[] };
    posts?: string[];
    chats?: string[];
    preferences?: {
        displayName?: string;
        bio?: string;
        profileImage?: string;
        theme?: string;
    };
}

export interface UserState {
    user?: UserTypes;
    updateUser: () => void;
}

export const defaultUser: UserTypes = {
    admin: false,
    following: { users: [], requests: [] },
    followers: { users: [], requests: [] },
    posts: [],
    chats: [],
    preferences: {
        displayName: "",
        bio: "",
        theme: "default",
    },
};

const defaultState: UserState = {
    user: defaultUser,
    updateUser: () => {},
};

export const UserContext = createContext<UserState>(defaultState);

type UserContextProviderTypes = {
    children: React.ReactNode;
};

function UserContextProvider({ children }: UserContextProviderTypes) {
    const [state, setState] = useState<UserTypes>(defaultUser);
    const [response] = useAsync.GET<UserTypes>({ func: getActiveUser }, true);

    useEffect(() => {
        const newState = response ? response.data : defaultUser;
        setState(newState || defaultUser);
    }, [response]);

    const updateUser = useCallback(() => {
        (async () => {
            const newState = await getActiveUser({}, null);
            setState({ ...state, ...newState });
        })();
    }, [state]);

    return (
        <UserContext.Provider
            value={useMemo(() => ({ user: defaultUser, updateUser }), [updateUser])}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
