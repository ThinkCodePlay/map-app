import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MapsService } from 'src/app/services/maps.service';

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.scss'],
})
export class MapFormComponent implements OnInit {
  zipFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.zipFormControl.value) {
      const zipcode = this.zipFormControl.value;
      this.mapsService.getGeoJson(zipcode.toString());
    }
  }
}
