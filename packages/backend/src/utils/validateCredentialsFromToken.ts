import bcrypt from "bcryptjs";
import User from "@b/models/user";
import * as Types from "./types";

const validateCredentialsFromToken = async (payload: Types.Token) => {
    const { accountTag, password } = payload;
    const { githubId } = payload.providerIds || { githubId: null };

    let user;
    if (githubId) {
        // for a github login, only the githubId needs to be verified
        user = await User.findOne({ githubId }, { _id: 1, githubId: 1 }).exec();
        if (!user) return [false, null, "Incorrect githubId."];
    } else if (accountTag && password) {
        // for an account tag + password login, both need to be verified
        user = await User.findOne({ accountTag }, { _id: 1, accountTag: 1, password: 1 }).exec();
        if (!user) return [false, null, "Incorrect account tag."];
        const match = bcrypt.compare(password, user.password as string);
        if (!match) return [false, null, "Incorrect password."];
        user.password = password; // Ensure password returned is not the hashed version
    } else {
        return [false, null, "No credentials found."];
    }

    return [true, user, null];
};

export default validateCredentialsFromToken;
