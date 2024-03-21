import bcrypt from "bcryptjs";
import User from "@/models/user";
import { Params as TokenParams } from "./generateToken";

const validateCredentialsFromToken = async (
    payload: TokenParams,
): Promise<[boolean, object | null, string | null]> => {
    const { accountTag, password, githubId } = payload;

    let user;
    if (githubId) {
        // for a provider login, only the id needs to be verified
        let error;
        user = await User.findOne({ githubId }).catch((err) => {
            error = [false, null, `${err.message}`];
        });
        if (error) return error;
        if (!user) return [false, null, `User with provided githubId not found.`];
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
