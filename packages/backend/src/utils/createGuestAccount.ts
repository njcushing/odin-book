import bcrypt from "bcryptjs";
import User from "@/models/user";

const createGuestAccount = async () => {
    const guestPassword = process.env.GUEST_PASSWORD;
    if (typeof guestPassword !== "string" || guestPassword.length === 0) {
        console.error("No guest password environment variable has been set");
        return;
    }
    bcrypt.hash(guestPassword, 10, async (hashErr, hashedPassword) => {
        if (hashErr) {
            console.error(hashErr.message || "Something went wrong hashing the guest password");
        }

        const guestUser = await User.findOne({ accountTag: "guest" });
        if (guestUser) return;

        const newUser = new User({
            type: "guest",
            accountTag: "guest",
            password: hashedPassword,
        });
        await newUser.save().catch((saveErr) => {
            if (saveErr.code !== 11000) {
                console.error(saveErr.message || "Guest user account creation failed");
            }
        });
    });
};

export default createGuestAccount;
