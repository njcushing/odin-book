import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";

const options: UploadApiOptions = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
};

const getPublicIdFromImageURL = (imageURL: string) => {
    const split = imageURL.split("/");
    if (split.length > 0) {
        const pop = split.pop();
        if (pop) {
            const final = pop.split(".");
            if (final.length > 0) {
                return final[0];
            }
        }
    }
    return "";
};

export const destroy = async (
    image: string,
    opts: UploadApiOptions = { resource_type: "image" },
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            getPublicIdFromImageURL(image),
            { resource_type: opts.resource_type },
            (error, result) => {
                if (result && result.secure_url) {
                    return resolve(result.secure_url);
                }
                return reject(error);
            },
        );
    });
};

export const single = async (
    image: string,
    opts: UploadApiOptions = options,
): Promise<string | Error> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                return resolve(result.secure_url);
            }
            return reject(error);
        });
    });
};

export const multiple = async (
    images: string[],
    opts: UploadApiOptions & { deleteAllOnFail: boolean } = { ...options, deleteAllOnFail: true },
): Promise<[boolean, (string | Error)[]]> => {
    // attempt to upload all images
    const uploads = images.map((image) => single(image, opts));
    const uploadResponses = await Promise.all(
        uploads.map(async (promise) => {
            return promise.then((result) => result).catch((error) => error);
        }),
    );
    // delete any successful uploads if any failed and 'deleteAllOnFail' option is true
    let failed = false;
    if (opts.deleteAllOnFail) {
        const imagesToDestroy = [];
        for (let i = 0; i < uploadResponses.length; i++) {
            const response = uploadResponses[i];
            if (typeof response !== "string") {
                failed = true;
            } else {
                imagesToDestroy.push(response);
            }
        }
    }
    if (failed) {
        const deletions = images.map((image) => destroy(image, opts));
        await Promise.all(deletions);
        return [false, uploadResponses];
    }
    return [!failed, uploadResponses];
};
