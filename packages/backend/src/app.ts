import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import passport from "passport";
import passportJWT from "passport-jwt";
import { fileURLToPath } from "url";
import path from "path";
import logger from "morgan";
import RateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import routes from "@/routes";
import dbConfig from "@/utils/dbConfig";
import cloudinaryConfig from "@/utils/cloudinaryConfig";
import sendResponse from "@/utils/sendResponse";
import validateCredentialsFromToken from "@/utils/validateCredentialsFromToken";
import * as Types from "@/utils/types";
import createGuestAccount from "./utils/createGuestAccount";

dotenv.config();
dbConfig();
cloudinaryConfig();

const app = express();

const limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000,
});
app.use(limiter);

app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            "img-src": ["'self'", "https://res.cloudinary.com", "data:"],
        },
    }),
);
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For all jwt-based login
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
app.use("/api/auth", routes.auth);
app.use("/api/user", routes.user);
app.use("/api/users", routes.users);
app.use("/api/post", routes.post);
app.use("/api/chat", routes.chat);

// Serve frontend
app.use(express.static(path.join(__dirname, "../../frontend")));
app.get("*", (req, res) => {
    res.sendFile("index.html", { root: path.join(__dirname, "../../frontend/") });
});

// Create guest account if necessary
createGuestAccount();

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

// Error handler
app.use((err: Types.ResponseError, req: Request, res: Response) => {
    sendResponse(res, err.status || 500, err.message, null, err);
});

export default app;
