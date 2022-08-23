import { Component } from '@angular/core';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading$ = this.loader.loading$; // observable hooked up to loading state

  constructor(public loader: LoadingService) {}
  title = 'Angular Map App';
}
