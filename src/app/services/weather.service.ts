import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}
  newWeatherJsonEmitter = new Subject<any>();
  private localWeather: any;
  getLocalWeatherByZipCode(zipcode: string) {
    if (zipcode) {
      this.http
        .get(
          `http://api.weatherapi.com/v1/current.json?key=${environment.weather_key}&q=${zipcode}&aqi=no`
        )
        .subscribe(
          (res) => {
            console.log(res);
            this.localWeather = res;
            this.newWeatherJsonEmitter.next(res);
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}
