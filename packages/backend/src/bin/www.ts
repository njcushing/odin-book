#!/usr/bin/env node

import debug from "debug";
import http from "http";
import app from "@/app";
import * as Types from "@/utils/types";

debug("odin-messaging-app:server");

// Get port from environment and store in Express.
const normalizePort = (val: string) => {
    const port = parseInt(val, 10);

    if (Number.isNaN(port)) return val; // Named pipe
    if (port >= 0) return port; // Port number

    return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Event listener for HTTP server "error" event
function onError(error: Types.SystemError) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    if (error.code === "EACCES") {
        // eslint-disable-next-line no-console
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
    }

    if (error.code === "EADDRINUSE") {
        // eslint-disable-next-line no-console
        console.error(`${bind} is already in use`);
        process.exit(1);
    }

    throw error;
}

// Event listener for HTTP server "listening" event
function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr && addr.port}`;
    debug(`Listening on ${bind}`);
}

// Create HTTP server & listen on provided port
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
