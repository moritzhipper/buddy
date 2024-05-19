import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import pgPromise from "pg-promise";
import { buddyDB } from "./buddy-db";
import { logger } from "./logger";
import { Routes } from "./routes/route-names";
import { UserCredentials } from "./types-and-schemas/types";
import { BuddySecretSchema } from "./types-and-schemas/validation-schemas";

// these Routes are only accessible via email and password credentials
const FULL_USER_ONLY_ROUTES = [Routes.GOALS, Routes.APPOINTMENTS, Routes.NOTES];

interface UserAuth {
    userID: string;
    isFullUser: boolean;
}

/**
 * Authorization Middleware does following:
 * - Skip authentification on route used to create initial auth key for auth key creation
 * - Authentificate using email and paswword from auth header when auth header exists
 * - Authentificate using Buddy-Secret header when header exists, auth header does not exist and requested is not for full users only
 */
export async function authorize(req: Request, res: Response, next: NextFunction) {
    const isCreateUserRequest = (req.path === Routes.USER && req.method === 'POST');
    const isCreateSessionRequest = (req.path === (Routes.AUTH + '/sessions') && req.method === 'POST');
    const sessionID = getSessionIDFromRequest(req);

    if (!isCreateSessionRequest && !isCreateUserRequest && !sessionID) {
        return next(createHttpError(401));
    }

    if (isCreateUserRequest || isCreateSessionRequest) {
        return next();
    }


    try {
        const isFullUserOnlyRoute = FULL_USER_ONLY_ROUTES.some(route => req.path.includes(route));

        const { isFullUser, userID } = await authorizeViaSessionID(sessionID);

        if (isFullUser || (!isFullUser && !isFullUserOnlyRoute)) {
            res.locals.userID = userID;
            return next();
        } else {
            return next(createHttpError(401, 'Setup Email and Password to access this functionality'));
        }

    } catch (e) {
        console.error(e);
        return next(createHttpError(401, 'No viable authentification method found'));
    }

}

/**
 * @param sessionID 
 * @returns userAuth
 */
async function authorizeViaSessionID(sessionID: string): Promise<UserAuth> {

    const result = await buddyDB.oneOrNone(`
        SELECT u.id, u.is_full_user, s.created_by_full_user
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.id=crypt($1, s.id)`,
        sessionID,
        (res) => ({ userID: res?.id, isFullUser: res?.isFullUser, sessionByFullUser: res?.created_by_full_user })
    );


    const sessionFound = !!result.userID;
    // following assertion should not be true because all sesiions of user are deleted on profile upgrade. Keeping this line for extra security
    const sessionCreatedWithLowerPrivileges = result.isFullUser && !result.sessionByFullUser;
    if (!sessionFound || sessionCreatedWithLowerPrivileges) throw createHttpError(401);


    return {
        userID: result.userID,
        isFullUser: result.isFullUser
    };
}

export async function getUserAuth(credentials: UserCredentials, t: pgPromise.ITask<{}>): Promise<UserAuth> {
    const isCredentialsRequest = !!(credentials.password) && (!!credentials.email || !!credentials.secret);
    const isQRKeyRequest = !credentials.password && !!credentials.secret;

    if (isCredentialsRequest) {
        return await getUserAuthViaCredentials(credentials, t);
    } else if (isQRKeyRequest) {
        return await getUserAuthViaBuddySecret(credentials.secret, t);
    } else {
        throw createHttpError(401)
    }
}

/**
 * returns userID from DB as long as basic auth is not set up.
 * @param buddySecretHeader Content of Header BuddySecret
 * @param t PGP task
 * @returns userID
 */
async function getUserAuthViaBuddySecret(buddySecretHeader: string, t: pgPromise.ITask<{}>): Promise<UserAuth> {
    logger.debug('Login via BuddySecret');

    const buddySecret = decoodeBuddySecret(buddySecretHeader);
    const result = await t.oneOrNone('select id, is_full_user from users where secret=$1', buddySecret);

    if (!result?.id) throw createHttpError(404, 'Keine Daten für diesen QR-Key gefunden.');
    if (result?.isFullUser) throw createHttpError(401, 'Bitte gib dein Passwort an.');

    return { userID: result.id, isFullUser: false };
}

/**
 * @param headerContent Content of Authorization Header
 * @param t PGP task
 * @returns UserAuth
 */
async function getUserAuthViaCredentials(credentials: UserCredentials, t: pgPromise.ITask<{}>): Promise<UserAuth> {
    logger.debug('Login via Credentials');

    let queryResult;

    if (credentials.email) {
        queryResult = await t.oneOrNone(
            `SELECT id, is_full_user FROM users WHERE email=$1 AND password=crypt($2, password)`,
            [credentials.email, credentials.password]
        );
    } else {
        const decodedSecret = decoodeBuddySecret(credentials.secret);
        queryResult = await t.oneOrNone(
            `SELECT id, is_full_user FROM users WHERE secret=$1 AND password=crypt($2, password)`,
            [decodedSecret, credentials.password]
        );
    }

    if (!queryResult?.id) throw createHttpError(404, 'No user having this email or password exists');
    if (!queryResult.isFullUser) throw createHttpError(401, 'Please setup login vie credentials');

    return { userID: queryResult.id, isFullUser: true };
}

function decoodeBuddySecret(encodedSecret: string): string {
    const buddySecretDecoded = BuddySecretSchema.parse(encodedSecret);
    return Buffer.from(buddySecretDecoded, 'base64url').toString();
}

export function getSessionIDFromRequest(req: Request): string {
    return req.cookies.sessionID || req.get('SessionID');
}

