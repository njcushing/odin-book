import * as apiFunctionTypes from "@shared/utils/apiFunctionTypes";
import * as modelTypes from "@/utils/modelTypes";
import * as mockData from "@/mockData";

export type Types = apiFunctionTypes.GET<modelTypes.User[]>;

const getRelatedUsers: Types = async (data, abortController = null, args = []) => {
    const users = mockData.getUsers(3);
    return {
        status: true,
        message: "Users found.",
        data: users,
    };
};

export default getRelatedUsers;
