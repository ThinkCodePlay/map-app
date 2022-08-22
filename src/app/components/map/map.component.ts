import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { MapsService } from 'src/app/services/maps.service';
import { WeatherService } from 'src/app/services/weather.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  style = 'mapbox://styles/mapbox/streets-v11';
  map!: mapboxgl.Map;
  source: any;
  hoveredStateId: any = null;
  mapGeoJson: any;
  popup: any;
  localWeather: any;

  constructor(
    private mapsService: MapsService,
    private weatherService: WeatherService
  ) {}

  private mapSub: Subscription = new Subscription();
  private weatherSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.buildMap();
    this.mapSub = this.mapsService.newGeoJsonEmitter.subscribe(
      (geoJson) => {
        this.mapGeoJson = geoJson;
        this.drawPolygon(geoJson);
      },
      (err) => {
        console.log(err);
      }
    );
    this.weatherSub = this.weatherService.newWeatherJsonEmitter.subscribe(
      (weather) => {
        this.localWeather = weather;
        console.log(this.localWeather);
      },
      (err) => {
        console.log(err);
      }
    );
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
      // center: [35.21371, 31.768319], // jerusalem
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
        generateId: true,
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

      // When the user moves their mouse over the state-fill layer, we'll update the
      // feature state for the feature under the mouse.
      this.map.on('mouseenter', 'poly', (e) => {
        console.log(e);

        if (e.features.length > 0) {
          if (this.hoveredStateId !== null) {
            this.map.setFeatureState(
              { source: 'poly', id: this.hoveredStateId },
              { hover: false }
            );
          }
          this.hoveredStateId = e.features[0].id;
          this.map.setFeatureState(
            { source: 'poly', id: this.hoveredStateId },
            { hover: true }
          );

          console.log(this.localWeather);

          this.popup = new mapboxgl.Popup({
            className: 'my-class',
          })
            .setLngLat(e.lngLat)
            .setHTML(
              `<h2>time: ${this.localWeather.location.localtime}</h2>
              <h2>tempreture: ${this.localWeather.current.temp_c}  &#8451</h2>`
            )
            .setMaxWidth('300px')
            .addTo(this.map);
        }
      });

      // When the mouse leaves the state-fill layer, update the feature state of the
      // previously hovered feature.
      this.map.on('mouseleave', 'poly', () => {
        if (this.hoveredStateId !== null) {
          this.map.setFeatureState(
            { source: 'poly', id: this.hoveredStateId },
            { hover: false }
          );
        }
        this.hoveredStateId = null;
        this.popup.remove();
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
