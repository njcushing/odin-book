import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import passport from "passport";
import passportJWT from "passport-jwt";
import passportGitHub2 from "passport-github2";
import { fileURLToPath } from "url";
import path from "path";
import logger from "morgan";
import RateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import routes from "@/routes";
import mongoose from "mongoose";
import dbConfig from "@/utils/dbConfig";
import sendResponse from "@/utils/sendResponse";
import User from "@/models/user";
import validateCredentialsFromToken from "@/utils/validateCredentialsFromToken";
import * as Types from "@/utils/types";

dotenv.config();
dbConfig();

const app = express();

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000,
});
app.use(limiter);

app.use(helmet());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For GitHub account creation & login
const GitHubStrategy = passportGitHub2.Strategy;
passport.use(
    "github",
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
            callbackURL: process.env.GITHUB_CALLBACK_URL || "",
        },
        async (
            accessToken: string | undefined,
            refreshToken: string | undefined,
            profile: { id: string },
            done: (err: Error | null, user: object | null, info?: { message?: string }) => void,
        ) => {
            let error;
            const user = await User.findOne({
                providers: { $elemMatch: { provider: "github", providerId: profile.id } },
            }).catch((err) => {
                error = err;
            });
            if (error) return done(error, null);
            if (!user) {
                const newUser = new User({
                    accountTag: new mongoose.Types.ObjectId(),
                    providers: [{ provider: "github", providerId: profile.id }],
                });
                if (newUser) return done(null, newUser, { message: "New account created." });
                return done(new Error("Could not create new user."), null);
            }
            return done(null, user);
        },
    ),
);

// For all token-based login
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.AUTH_CLIENT_SECRET as string,
        },
        async (jwt_payload, done) => {
            try {
                const [status, user, message] = await validateCredentialsFromToken(jwt_payload);
                if (!status) return done(null, false, { message });
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        },
    ),
);

app.use(logger("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(compression());

// CORS config
const trustedDomains: string[] = (process.env.TRUSTED_DOMAINS as unknown as string[]) || [];
const getCorsOpts = (
    req: Request,
    callback: (err: Error | null, opts: { origin: boolean }) => void,
) => {
    let corsOpts;
    const domain = req.header("Origin");
    if (domain && trustedDomains.includes(domain)) {
        corsOpts = { origin: true };
    } else {
        corsOpts = { origin: false };
    }
    callback(null, corsOpts);
};
app.use("*", cors(getCorsOpts));

// Routes
app.use("/", routes.index);
app.use("/auth", routes.auth);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// Error handler
app.use((err: Types.ResponseError, req: Request, res: Response) => {
    sendResponse(res, err.status || 500, err.message, null, err);
});

export default app;
