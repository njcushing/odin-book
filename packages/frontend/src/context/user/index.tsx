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
    awaitingResponse: boolean;
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
    awaitingResponse: false,
};

export const UserContext = createContext<UserState>(defaultState);

type UserContextProviderTypes = {
    children: React.ReactNode;
};

function UserContextProvider({ children }: UserContextProviderTypes) {
    const [state, setState] = useState<UserTypes>(defaultUser);
    const [response] = useAsync.GET<UserTypes>({ func: getActiveUser }, true);
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(
        defaultState.awaitingResponse,
    );

    useEffect(() => {
        const newState = response ? response.data : defaultUser;
        setState(newState || defaultUser);
    }, [response]);

    const updateUser = useCallback(() => {
        setAwaitingResponse(true);
        (async () => {
            const newState = await getActiveUser({}, null);
            setState({ ...state, ...newState });
            setAwaitingResponse(false);
        })();
    }, [state]);

    return (
        <UserContext.Provider
            value={useMemo(
                () => ({ user: defaultUser, updateUser, awaitingResponse }),
                [updateUser, awaitingResponse],
            )}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
