import packageJson from "../../package.json";

/**
 * Authoritative Application Version
 * Derived directly from package.json version field.
 * Client bundle receives only this string constant.
 */
export const APP_VERSION: string = packageJson.version;
