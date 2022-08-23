import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}
  newWeatherJsonEmitter = new Subject<any>();
  private localWeather: any;
  getLocalWeatherByZipCode(zipcode: string) {
    if (zipcode) {
      this.http
        .get(
          `${environment.weather_api_domain}?key=${environment.weather_key}&q=${zipcode}&aqi=no`
        )
        .subscribe(
          (res) => {
            this.localWeather = res;
            this.newWeatherJsonEmitter.next(res);
          },
          (err) => {
            this.snackbarService.openSnackBar(
              'Hmm... It seems an error accord ',
              'Dismiss'
            );
          }
        );
    }
  }
}
