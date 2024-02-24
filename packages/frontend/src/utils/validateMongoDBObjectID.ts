import mongoose from "mongoose";

const validateMongoDBObjectID = (
    id:
        | string
        | number
        | mongoose.mongo.BSON.ObjectId
        | mongoose.mongo.BSON.ObjectIdLike
        | Uint8Array,
): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export default validateMongoDBObjectID;
