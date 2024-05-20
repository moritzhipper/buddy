import createHttpError from "http-errors";
import { logger } from "./logger";

export const ERROR_TEXT_DEFAULT = 'An Error occured. 😔';

export function errorHandler(err, req, res, next) {
    /**
     * 'err' can only be instance of HttpError if explicitly thrown. This is why we can return error specifics to client.
     * When 'err' is not of type HttpError we encounter a technical exception and return a standard error to hide specifics from client
     */
    if (err instanceof createHttpError.HttpError) {
        logger.debug({
            msg: `Sent NOK to client with message '${err.message}'`,
            status: err.status
        });

        res.status(err.status).send({ message: err.message });
    } else {
        logger.error(err);
        res.status(500).send({ message: ERROR_TEXT_DEFAULT });
    }
}
