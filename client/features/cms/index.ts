/**
 * Client-safe surface of the CMS feature.
 *
 * Server data access lives in `./api/server` and must be imported directly, so
 * that client components can consume the resolvers and types here without
 * pulling `server-only` into the browser bundle.
 */
export * from "./types";
export * from "./defaults";
export * from "./resolve";
