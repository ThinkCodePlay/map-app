import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { IFeatureCollection } from 'src/app/interface/geoJson';
import { IMapBoxMouseEvent } from 'src/app/interface/mouseevent';
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
    // subscribe to map service
    this.mapSub = this.mapsService.newGeoJsonEmitter.subscribe(
      (geoJson: IFeatureCollection) => {
        if (geoJson.features.length > 0) {
          this.mapGeoJson = geoJson;
          this.drawPolygon(geoJson);
          this.centerOnMapPolygon(geoJson);
          const currentZipcode = this.mapsService.currentZipcode;
          console.log(currentZipcode);
          this.weatherService.getLocalWeather(currentZipcode); // get local time and weather only if zipcode returned data
        } else {
          // TODO Toast
          alert('no data for this zipcode');
        }
      },
      (err) => {
        // TODO Toast
        console.log(err);
      }
    );
    // subscribe to weather service
    this.weatherSub = this.weatherService.newWeatherJsonEmitter.subscribe(
      (weather) => {
        console.log('weather', weather);
        this.localWeather = weather;
        console.log(this.localWeather);
      },
      (err) => {
        // TODO Toast
        console.log(err);
      }
    );
  }

  // prevent memory leak!
  ngOnDestroy(): void {
    this.mapSub.unsubscribe();
    this.weatherSub.unsubscribe();
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
      this.map.on('mouseenter', 'poly', (e: IMapBoxMouseEvent) => {
        if (e.features && e.features.length > 0) {
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
            // can't create component because the html is baked into the popup
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

  drawPolygon(geoJson: IFeatureCollection) {
    this.source = this.map.getSource('poly');
    const feature = geoJson.features[0];
    const { type, geometry, properties } = feature;

    // the polygon coordinates to set
    let data = {
      type,
      geometry,
      properties,
    };
    this.source.setData(data);
  }

  centerOnMapPolygon(geoJson: IFeatureCollection) {
    const feature = geoJson.features[0];
    const { geometry } = feature;
    const coords = geometry.coordinates;

    // Create a 'LngLatBounds' with both corners at the first coordinate.
    const bounds = new mapboxgl.LngLatBounds(
      coords[0][0] as mapboxgl.LngLatLike,
      coords[0][0] as mapboxgl.LngLatLike
    );

    // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
    for (const coord of coords[0]) {
      bounds.extend(coord as mapboxgl.LngLatLike);
    }
    this.map.fitBounds(bounds, {
      padding: 20,
    });
  }

  changeLocation(lng: number, lat: number) {
    this.map.flyTo({ center: [lng, lat] });
  }
}
