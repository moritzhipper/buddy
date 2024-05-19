const env = process.env;
const environment = {
   nodeEnv: env.NODE_ENV,
   port: env.PORT,
   logLevel: env.LOG_LEVEL,
   dbUser: env.DB_USER,
   dbPW: env.DB_PW,
   dbPort: env.DB_PORT,
   host: env.HOST,
};

// verify that all values are set.
const emptyKeys = Object.keys(environment).filter((key) => !environment[key]);
if (emptyKeys.length > 0)
   throw Error(`Missing env values for ${JSON.stringify(emptyKeys)}`);

export = environment;
