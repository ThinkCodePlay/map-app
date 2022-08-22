// interface IGeometry {
//   type: string;
//   coordinates: number[][][];
// }
// interface IFeature {
//   type: string;
//   properties: {
//     zipCode: string;
//     country: string;
//     city: string;
//     county: string;
//     state: string;
//   };
//   geometry: IGeometry;
// }
// export interface IGeoJson {
//   type: string;
//   features: IFeature[];
// }

export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  properties?: any;
  $key?: string;
}

export class GeoJson implements IGeoJson {
  type = 'Feature';
  geometry: IGeometry;

  constructor(coordinates: any, public properties?: any) {
    this.geometry = {
      type: 'Point',
      coordinates: coordinates,
    };
  }
}

export class FeatureCollection {
  type = 'FeatureCollection';
  constructor(public features: Array<GeoJson>) {}
}
