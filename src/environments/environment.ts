// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  boundaries_url:
    'https://vanitysoft-boundaries-io-v1.p.rapidapi.com/rest/v1/public',
  'X-RapidAPI-Key': 'f14dfc7e38msh6c462596c42d6aep12ac80jsn9d9cb5cf818c',
  'X-RapidAPI-Host': 'vanitysoft-boundaries-io-v1.p.rapidapi.com',
  mapbox: {
    accessToken:
      'pk.eyJ1IjoiandlYmRldiIsImEiOiJjbDc0ZmU1NjAwOW90M250aDJtZG5tMmJiIn0.YdqgvikWgQKr1Yvq45N75Q',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
