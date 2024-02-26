// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendUrl: "http://localhost:8080",
  fitbitStepsUrl: `https://api.fitbit.com/1/user/-/activities/tracker/steps/date/`,
  fitbitCaloriesUrl: `https://api.fitbit.com/1/user/-/activities/tracker/calories/date/`,
  googleFitStepsUrl: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
  encryptKey: "123456$#@$^@1ERF",
  miracleLogIn: `https://dev-hubble-api.miraclesoft.com/hubble-v2/employee/login`,
  fibitProfile:`https://api.fitbit.com/1/user/-/profile.json`,
  miracleSearch: `https://dev-hubble-api.miraclesoft.com/hubble-v2/employee/suggestion-list?searchKey=`,
  mftlogin: "http://localhost:8080/api/v1/auth/login",
  mftSearch: `http://localhost:8080/api/v1/search?query=`,
  mftFollowing:`http://localhost:8080/api/v1/users/`
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
