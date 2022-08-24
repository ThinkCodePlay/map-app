import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { IFeatureCollection } from 'src/app/interface/geoJson';
import { IMapBoxMouseEvent } from 'src/app/interface/mouseevent';
import { MapsService } from 'src/app/services/maps.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { WeatherService } from 'src/app/services/weather.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  style: string = 'mapbox://styles/mapbox/streets-v11';
  map!: mapboxgl.Map;
  source: any;
  hoveredStateId: any = null;
  popup: any;
  localWeather: any;

  // create subscription to get service events
  private mapSub: Subscription = new Subscription();
  private weatherSub: Subscription = new Subscription();

  constructor(
    private mapsService: MapsService,
    private weatherService: WeatherService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.buildMap();
    // subscribe to map service
    this.mapSub = this.mapsService.newGeoJsonEmitter.subscribe(
      (geoJson: IFeatureCollection) => {
        if (geoJson.features.length > 0) {
          this.drawPolygon(geoJson);
          this.centerOnMapPolygon(geoJson);
          const currentZipcode = this.mapsService.currentZipcode;
          this.weatherService.getLocalWeatherByZipCode(currentZipcode);
        } else {
          this.snackbarService.openSnackBar(
            'There is no data for this zip code',
            'Dismiss'
          );
        }
      },
      (err) => {
        this.snackbarService.openSnackBar(
          'Error fetching location',
          'Dismiss'
        );
      }
    );
    // subscribe to weather service
    this.weatherSub = this.weatherService.newWeatherJsonEmitter.subscribe(
      (weather) => {
        this.localWeather = weather;
      },
      (err) => {
        this.snackbarService.openSnackBar(
          'Error fetching local weather data',
          'Dismiss'
        );
      }
    );
  }

  // to prevent memory leak!
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
      center: [35.21371, 31.768319], // jerusalem
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.mapOnLoadSetting();
  }

  mapOnLoadSetting() {
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

      this.mapOnMouseEnterSetting();
      this.mapOnMouseLeave();
    });
  }

  mapOnMouseEnterSetting() {
    try {
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
          // create popup on enter polygon at mouse enter location
          this.popup = new mapboxgl.Popup({
            className: 'my-class',
          })
            .setLngLat(e.lngLat)
            // can't create component because the html is baked into the popup
            .setHTML(
              `<label>Name: ${this.localWeather.location.name}, ${this.localWeather.location.region}, ${this.localWeather.location.country}</label><br />
            <label>Local Date and Time: ${this.localWeather.location.localtime}</label><br />
            <label>Tempreture: ${this.localWeather.current.temp_c}  &#8451 <img src="${this.localWeather.current.condition.icon}" alt="condition-icon"></label>
            `
            )
            .setMaxWidth('300px')
            .addTo(this.map);
        }
      });
    } catch (error) {}
  }

  mapOnMouseLeave() {
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
