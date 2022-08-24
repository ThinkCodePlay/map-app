# Angular Map-App🗺️ 

### Description
This web app displays US locations and weather by its ZIP code.

Check out the **live demo** [here](https://map-app-flame.vercel.app/).

## Usage

### Dependencies

The frontend of this app was built using [**Angular**](https://angular.io/) framework.
For styling I used [**Bootstrap**](https://getbootstrap.com/) and [**Angular  Material UI**](https://material.angular.io/).

Three 3rd party packages were used to fetch and display the data:
1. [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs)
2. [boundaries-io](https://rapidapi.com/VanitySoft/api/boundaries-io-1)
3. [weatherapi](https://www.weatherapi.com)

To integrate with these APIs you must acquire a **valid token** and insert them into the environment variables (***be careful not to expose them in production**).

## Development server

Map-App requires [Node.js](https://nodejs.org/) and [Angular](https://angular.io/)  to run.


Install the dependencies with:
```sh
npm install
```


Run `ng serve` for a dev server, navigate to `http://localhost:4200/`.
