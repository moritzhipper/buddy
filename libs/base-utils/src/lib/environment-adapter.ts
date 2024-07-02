type EnvironmentType = {
   nodeEnv: string
   port: string
   logLevel: string
   dbUser: string
   dbPW: string
   dbPort: string
   host: string
   vapidKeyPrivate: string
   vapidKeyPublic: string
}

function readEnvironmentKeys(processEnv: any): EnvironmentType {
   return {
      nodeEnv: processEnv['NODE_ENV'],
      port: processEnv['PORT'],
      logLevel: processEnv['LOG_LEVEL'],
      dbUser: processEnv['DB_USER'],
      dbPW: processEnv['DB_PW'],
      dbPort: processEnv['DB_PORT'],
      host: processEnv['HOST'],
      vapidKeyPrivate: processEnv['VAPID_KEY_PRIVATE'],
      vapidKeyPublic: processEnv['VAPID_KEY_PUBLIC'],
   }
}

function verifyAllEnvironmentKeysAreSet(environment: any): void {
   const emptyKeys = Object.keys(environment).filter((key) => !environment[key])
   if (emptyKeys.length > 0) throw Error(`Missing env values for ${JSON.stringify(emptyKeys)}`)
}

export function getEnvironmentKeys(processEnv: any): EnvironmentType {
   const environment = readEnvironmentKeys(processEnv)
   verifyAllEnvironmentKeysAreSet(environment)
   return environment
}
