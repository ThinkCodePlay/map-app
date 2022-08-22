import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { IGeoJson } from '../interface/geoJson';
@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private http: HttpClient) {}

  newGeoJsonEmitter = new Subject<any>();
  // private geoJson;

  // getGeoJson(zipcode: string) {
  //   const req = this.http
  //     .get(
  //       `${environment.boundaries_url}/boundary/zipcode?zipcode=${zipcode}`,
  //       {
  //         headers: {
  //           'X-RapidAPI-Key': environment['X-RapidAPI-Key'],
  //           'X-RapidAPI-Host': environment['X-RapidAPI-Host'],
  //         },
  //       }
  //     )
  //     .subscribe(
  //       (res) => {
  //         this.geoJson = res;
  //         this.newGeoJsonEmitter.next(res);
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  // }

  calculateCenter(coords: any): [number, number] {
    let minLng = coords[0][0];
    let maxLng = coords[0][0];
    let minLat = coords[0][1];
    let maxLat = coords[0][1];
    coords.forEach((element) => {
      const [lng, lat] = element;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(minLng, lng);
    });
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;
    console.log(centerLng, centerLat);

    return [centerLng, centerLat];
  }

  // dummy data
  private geoJson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          zipCode: '22066',
          country: 'US',
          city: 'Great falls',
          county: 'Fairfax',
          state: 'VA',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-77.371303, 39.014584],
              [-77.365904, 39.020222],
              [-77.360754, 39.025508],
              [-77.363432, 39.02518],
              [-77.361363, 39.028497],
              [-77.360407, 39.030543],
              [-77.362585, 39.031395],
              [-77.365104, 39.034173],
              [-77.365028, 39.036218],
              [-77.361522, 39.036732],
              [-77.357466, 39.035911],
              [-77.358025, 39.033889],
              [-77.356297, 39.032572],
              [-77.354233, 39.034219],
              [-77.35204, 39.034075],
              [-77.340999, 39.045226],
              [-77.337669, 39.04835],
              [-77.334269, 39.052044],
              [-77.328281093199, 39.0577948715365],
              [-77.324206, 39.056508],
              [-77.314905, 39.052208],
              [-77.310705, 39.052008],
              [-77.301005, 39.049508],
              [-77.293105, 39.046508],
              [-77.2929560690926, 39.0464074904572],
              [-77.2827172827481, 39.0394976035047],
              [-77.274706, 39.034091],
              [-77.266004, 39.031909],
              [-77.255303, 39.030009],
              [-77.248403, 39.026909],
              [-77.2483830315804, 39.0268923596504],
              [-77.246003, 39.024909],
              [-77.244603, 39.020109],
              [-77.246903, 39.014809],
              [-77.251803, 39.011409],
              [-77.255703, 39.002409],
              [-77.253003, 38.995709],
              [-77.249203, 38.993709],
              [-77.248303, 38.992309],
              [-77.246172, 38.985749],
              [-77.244621, 38.982535],
              [-77.241081, 38.981206],
              [-77.234803, 38.97631],
              [-77.23506, 38.974903],
              [-77.237117, 38.974464],
              [-77.239062, 38.976509],
              [-77.243557, 38.977116],
              [-77.246031, 38.975802],
              [-77.248946, 38.978524],
              [-77.253294, 38.977941],
              [-77.255273, 38.980722],
              [-77.256973, 38.98164],
              [-77.257269, 38.978664],
              [-77.254953, 38.975139],
              [-77.253308, 38.973593],
              [-77.253637, 38.972649],
              [-77.252329, 38.970131],
              [-77.254424, 38.969445],
              [-77.25345, 38.966848],
              [-77.258713, 38.965247],
              [-77.260678, 38.961489],
              [-77.26084, 38.958444],
              [-77.261808, 38.956034],
              [-77.264362, 38.951351],
              [-77.272498, 38.956552],
              [-77.283791, 38.964575],
              [-77.287799, 38.966075],
              [-77.293592, 38.968247],
              [-77.303757, 38.974018],
              [-77.304964, 38.974565],
              [-77.313048, 38.976938],
              [-77.315141, 38.977778],
              [-77.318624, 38.979891],
              [-77.324082, 38.986379],
              [-77.327936, 38.988718],
              [-77.326771, 38.990259],
              [-77.325085, 38.989484],
              [-77.324071, 38.993064],
              [-77.325111, 38.993371],
              [-77.327269, 38.993919],
              [-77.327421, 38.99283],
              [-77.329359, 38.992826],
              [-77.329357, 38.989546],
              [-77.341465, 38.998325],
              [-77.343785, 38.999906],
              [-77.367748, 39.012819],
              [-77.371303, 39.014584],
            ],
          ],
        },
      },
    ],
  };
  getGeoJson(zipcode: string) {
    this.newGeoJsonEmitter.next(this.geoJson);
  }
}