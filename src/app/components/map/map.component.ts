import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { FeatureCollection } from 'src/app/interface/geoJson';
// import { IGeoJson } from 'src/app/interface/geoJson';
import { MapsService } from 'src/app/services/maps.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;
  map!: mapboxgl.Map;
  source: any;
  markers: any;

  mapGeoJson: any;

  constructor(private mapsService: MapsService) {}

  private mapSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.buildMap();
    this.mapSub = this.mapsService.newGeoJsonEmitter.subscribe((geoJson) => {
      this.mapGeoJson = geoJson;
      this.drawPolygon(geoJson);
    });
  }

  ngOnDestroy(): void {
    this.mapSub.unsubscribe();
  }

  buildMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 12,
      center: [-77.371303, 39.014584],
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', (event) => {
      /// register source
      this.map.addSource('poly', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      /// create map layers do display polygon
      this.map.addLayer({
        id: 'poly',
        source: 'poly',
        type: 'fill',
        layout: {},
        paint: {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.5,
        },
      });
    });
  }

  drawPolygon(geoJson: any) {
    this.source = this.map.getSource('poly');

    const feature = geoJson.features[0]; // will only show one feature at the moment
    const { type, geometry, properties } = feature;
    const coords = geometry.coordinates;

    // the polygon coordinates to set
    let data = {
      type,
      geometry,
      properties,
    };
    this.source.setData(data);
    const [lng, lat] = this.mapsService.calculateCenter(coords[0]);
    this.changeLocation(lng, lat);
  }

  changeLocation(lng: number, lat: number) {
    this.map.flyTo({ center: [lng, lat] });
  }
}
