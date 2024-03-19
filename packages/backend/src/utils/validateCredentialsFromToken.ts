import bcrypt from "bcryptjs";
import User from "@/models/user";
import { Params as TokenParams } from "./generateToken";

const validateCredentialsFromToken = async (
    payload: TokenParams,
): Promise<[boolean, object | null, string | null]> => {
    const { accountTag, password } = payload;
    const providedBy = payload.providedBy || { provider: null, providerId: null };

    let user;
    if (providedBy) {
        // for a provider login, only the providerId needs to be verified
        const { provider, providerId } = providedBy;
        if (!provider || provider.length === 0) {
            return [false, null, "Provider name not specified."];
        }
        if (!providerId || provider.length === 0) {
            return [false, null, "Provider id not specified."];
        }
        let error;
        user = await User.findOne({ providers: { $elemMatch: { provider, providerId } } }).catch(
            (err) => {
                error = [false, null, `${err.message}`];
            },
        );
        if (error) return error;
        if (!user) return [false, null, `User with provided credentials not found.`];
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
