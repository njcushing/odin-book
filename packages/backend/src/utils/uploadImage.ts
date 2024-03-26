import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

const options: UploadApiOptions = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};

const uploadImage = async (image: string, opts: UploadApiOptions = options) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }
            return reject(error);
        });
    });
};

export default uploadImage;
