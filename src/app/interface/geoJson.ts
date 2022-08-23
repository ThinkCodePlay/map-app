export interface IGeometry {
  type: string;
  coordinates: Array<Array<[number, number]>>;
}
export interface IFeature {
  type: string;
  properties: {
    zipCode: string;
    country: string;
    city: string;
    county: string;
    state: string;
  };
  geometry: IGeometry;
}
export interface IFeatureCollection {
  type: string;
  features: IFeature[];
}
