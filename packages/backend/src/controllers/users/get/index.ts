import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import protectedRouteJWT from "@/utils/protectedRouteJWT";
import sendResponse from "@/utils/sendResponse";
import generateToken from "@/utils/generateToken";
import User from "@/models/user";
import validators from "../validators";

export const all = [
    protectedRouteJWT,
    validators.query.limit,
    validators.query.excludeActiveUser,
    validators.query.after,
    asyncHandler(async (req: Request, res: Response) => {
        const { limit, excludeActiveUser, after } = req.query;

        /// create aggregation pipeline
        const aggregation: mongoose.PipelineStage[] = [];
        // match all users
        aggregation.push({ $match: {} });
        // group all users into an array field
        aggregation.push({
            $group: {
                _id: null, // Group all documents into a single group
                users: { $push: "$$ROOT" }, // Push all documents into an array called 'users'
            },
        });
        // if 'excludeActiveUser' is true, attempt to filter out the active user
        if (excludeActiveUser) {
            aggregation.push({
                $addFields: {
                    users: {
                        $filter: {
                            input: "$users",
                            cond: {
                                $ne: [
                                    "$$this._id",
                                    new mongoose.Types.ObjectId(`${res.locals.user.id}`),
                                ],
                            },
                        },
                    },
                },
            });
        }
        // sort the users alphabetically by their 'accountTag' field
        aggregation.push({
            $project: {
                users: {
                    $sortArray: {
                        input: "$users",
                        sortBy: { accountTag: 1 },
                    },
                },
            },
        });
        // if 'after' query parameter is specified, check user is within 'users' array
        let responding = false;
        if (after) {
            aggregation.push({
                $match: { "users._id": new mongoose.Types.ObjectId(`${after}`) },
            });
            // check user exists in the database
            const afterUser = await User.findById(after);
            if (!afterUser) {
                sendResponse(res, 404, "Specified 'after' user not found in the database");
                responding = true;
            } else {
                // and slice the array to remove users whose 'accountTag' fields are before the
                // 'after' user's alphabetically
                aggregation.push({
                    $addFields: {
                        afterUserIndex: { $indexOfArray: ["$users._id", afterUser._id] },
                    },
                });
                aggregation.push({
                    $project: {
                        users: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $gte: ["$afterUserIndex", 0] },
                                        {
                                            $lt: [
                                                "$afterUserIndex",
                                                { $subtract: [{ $size: "$users" }, 1] },
                                            ],
                                        },
                                    ],
                                },
                                then: {
                                    $slice: [
                                        "$users",
                                        { $add: ["$afterUserIndex", 1] },
                                        {
                                            $subtract: [
                                                { $size: "$users" },
                                                { $add: ["$afterUserIndex", 1] },
                                            ],
                                        },
                                    ],
                                },
                                else: [],
                            },
                        },
                    },
                });
            }
        }
        if (!responding) {
            // limit users
            if (limit) {
                aggregation.push({ $project: { users: { $slice: ["$users", Number(3)] } } });
            }
            // final projection
            aggregation.push({
                $project: {
                    _id: 0,
                    users: {
                        $map: {
                            input: "$users",
                            as: "user",
                            in: "$$user._id",
                        },
                    },
                },
            });
            // execute aggregation
            const aggregationResult = await User.aggregate(aggregation).exec();
            if (aggregationResult.length === 0) {
                sendResponse(res, 404, "Could not find users");
            } else {
                const allUsers = aggregationResult[0].users;
                await generateToken(res.locals.user)
                    .then((token) => {
                        sendResponse(res, 200, "Users found", {
                            token,
                            users: allUsers,
                        });
                    })
                    .catch((tokenErr) => {
                        sendResponse(
                            res,
                            500,
                            tokenErr.message || `Users found, but token creation failed`,
                            { users: allUsers },
                            tokenErr,
                        );
                    });
            }
        }
    }),
];
