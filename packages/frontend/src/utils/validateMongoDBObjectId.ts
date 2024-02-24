import mongoose from "mongoose";
import * as extendedTypes from "@/utils/extendedTypes";

const validateMongoDBObjectId = (id: extendedTypes.MongoDBObjectId): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export default validateMongoDBObjectId;
