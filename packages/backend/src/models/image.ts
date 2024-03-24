import mongoose from "mongoose";

const { Schema } = mongoose;

const ImageSchema = new Schema(
    {
        url: {
            type: String,
            default: null,
        },
    },
    {
        getters: true,
        timestamps: true,
    },
);

ImageSchema.set("toObject", { virtuals: true });
ImageSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Image", ImageSchema);
