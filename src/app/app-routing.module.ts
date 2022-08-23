import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/UI/layout/layout.component';
import { PageNotFoundComponent } from './components/UI/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: LayoutComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
