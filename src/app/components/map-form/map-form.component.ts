import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MapsService } from 'src/app/services/maps.service';

@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.scss'],
})
export class MapFormComponent implements OnInit {
  @ViewChild('login')
  private _loginNgForm!: NgForm;

  inProgess: boolean = false;
  zipFormGroup: FormGroup = new FormGroup({
    zipFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  constructor(private mapsService: MapsService) {}

  ngOnInit(): void {}

  onSubmit() {
    const input = this.zipFormGroup.get('zipFormControl')?.value;
    if (input) {
      this.mapsService.getGeoJson(input);
      this._loginNgForm.resetForm();
    }
  }

  // getter for easy access to form fields in html
  get f() {
    return this.zipFormGroup.controls;
  }
}
