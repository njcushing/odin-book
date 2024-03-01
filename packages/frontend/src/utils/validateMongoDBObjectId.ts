import mongoose from "mongoose";
import * as extendedTypes from "@shared/utils/extendedTypes";

const validateMongoDBObjectId = (id: extendedTypes.MongoDBObjectId): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
};

export default validateMongoDBObjectId;
