import mongoose, { Schema, Document } from "mongoose";

export type TImage = {
    url: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IImage extends TImage, Document {}

const ImageSchema: Schema = new Schema(
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

export default mongoose.model<IImage>("Image", ImageSchema);
