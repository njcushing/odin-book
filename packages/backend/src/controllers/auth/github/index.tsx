import passport from "passport";

export const get = [passport.authenticate("github", { session: false, scope: ["user:email"] })];

export const callback = [passport.authenticate("github", { session: false })];
