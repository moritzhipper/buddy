// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { BuddyEnvironment } from './buddy-environment-interface'

export const environment: BuddyEnvironment = {
   production: false,
   backendUrl: 'http://localhost:5200',
   vapidKeyPublic: 'BBZYBgvEegKC57oonu8SiZ64A0Xq3MktHLTgs7oJYaw2iQ7j5Qa_TVaHTrmS3gXGIn_lRtq0BJopaEIpu0755ao',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
