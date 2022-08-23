export type IMapBoxMouseEvent = mapboxgl.MapMouseEvent & {
  features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
} & mapboxgl.EventData;
