import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import * as useAsync from "@/hooks/useAsync";
import * as extendedTypes from "@shared/utils/extendedTypes";
import getActiveUser from "./utils/getActiveUser";
import extractUserProperty from "./utils/extractUserProperty";

export interface UserTypes {
    _id: extendedTypes.MongoDBObjectId | null;
    accountTag: string;
    githubId?: string;
    email?: string;
    followingCount: number;
    followingRequestCount: number;
    followersCount: number;
    followersRequestCount: number;
    postCount: number;
    likesCount: number;
    repliesCount: number;
    preferences: {
        displayName: string;
        bio: string;
        profileImage: {
            _id: extendedTypes.MongoDBObjectId;
            url: string;
        } | null;
        theme: string;
    };
    creationDate: string;
}

export interface UserState {
    user?: UserTypes;
    updateUser: () => void;
    awaitingResponse: boolean;
    extract: (property: string) => unknown;
}

export const defaultUser: UserTypes = {
    _id: null,
    accountTag: "",
    followingCount: 0,
    followingRequestCount: 0,
    followersCount: 0,
    followersRequestCount: 0,
    postCount: 0,
    likesCount: 0,
    repliesCount: 0,
    preferences: {
        displayName: "",
        bio: "",
        profileImage: null,
        theme: "default",
    },
    creationDate: "1900-01-01T00:00:00.000Z",
};

const defaultState: UserState = {
    user: defaultUser,
    updateUser: () => {},
    awaitingResponse: false,
    extract: (property: string) => {
        return extractUserProperty(defaultUser, property);
    },
};

export const UserContext = createContext<UserState>(defaultState);

type UserContextProviderTypes = {
    children: React.ReactNode;
};

function UserContextProvider({ children }: UserContextProviderTypes) {
    const [state, setState] = useState<UserTypes>(defaultUser);
    const [response, setParams, setAttempting] = useAsync.GET<UserTypes>(
        { func: getActiveUser },
        true,
    );
    const [awaitingResponse, setAwaitingResponse] = useState<boolean>(
        defaultState.awaitingResponse,
    );

    useEffect(() => {
        const newState = response ? response.data : defaultUser;
        setState(newState || defaultUser);
        setAwaitingResponse(false);
    }, [response]);

    const updateUser = useCallback(() => {
        setAwaitingResponse(true);
        setAttempting(true);
    }, [setAttempting]);

    const extract = useCallback(
        (property: string) => {
            return extractUserProperty(state, property);
        },
        [state],
    );

    return (
        <UserContext.Provider
            value={useMemo(
                () => ({ user: state, updateUser, awaitingResponse, extract }),
                [state, updateUser, awaitingResponse, extract],
            )}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserContextProvider;
