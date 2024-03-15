import { Response } from "express";

const sendResponse = (
    res: Response,
    status: number = 500,
    message: string = "",
    data = null,
    err: Error | null = null,
) => {
    if (process.env.NODE_ENV === "development") {
        let statusValue = 500;
        if (Number.isInteger(status)) {
            statusValue = status;
            if (err && "status" in err && err.status) {
                statusValue = err.status as number;
            } else {
                statusValue = status;
            }
        }

        let stackString = "";
        if (err && typeof err.stack === "string") {
            stackString = err.stack;
        }

        return res.status(status).send({
            status: statusValue,
            stack: stackString,
            message,
            data,
        });
    }
    return res.status(status).send({
        status,
        message,
        data,
    });
};

export default sendResponse;
