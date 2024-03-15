import mongoose from "mongoose";

const dbConfig = () => {
    mongoose.set("strictQuery", false);

    const mongoDB = process.env.MONGO_URI || null;

    async function main() {
        if (mongoDB) {
            await mongoose.connect(mongoDB);
        } else {
            throw new Error(
                "No MongoDB connection string was provided. Aborting connection attempt.",
            );
        }
    }

    // eslint-disable-next-line no-console
    main().catch((err) => console.log(err));
};

export default dbConfig;
