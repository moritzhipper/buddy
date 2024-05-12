import pgPromise from "pg-promise";
import environment from "./environment-adapter";
import { logger } from "./logger";
import { remapKeys } from "./mapper";

const pgp = pgPromise({
    receive(e) {
        remapKeys(e.data, false);
    }
});

// circumvent pg-promise converting psql DATE to JavaScript date
pgp.pg.types.setTypeParser(1082, (date) => date);

const DB_USER = environment.dbUser;
const DB_PW = environment.dbPW;
const DB_PORT = environment.dbPort;
const DB_HOST = environment.dbHost;

const buddyConnection = `postgres://${DB_USER}:${DB_PW}@${DB_HOST}:${DB_PORT}/buddy`;
const buddyDB = pgp(buddyConnection);

/**
 * Tries to connect to to database using config parameters from environment.
 * Throws error when connection fails.
 */
async function testDBConnection() {
    try {
        const c = await buddyDB.connect();
        c.done();
        logger.info('Succesfully connected to database');
    } catch (e) {
        logger.error('Can not connect to DB');
        throw e;
    }
}

export { buddyDB, pgp, testDBConnection };