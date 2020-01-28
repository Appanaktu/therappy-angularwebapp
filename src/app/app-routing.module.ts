import { ErstelleNutzerComponent } from './components/nutzer/erstelle-nutzer/erstelle-nutzer.component';
import { NutzerListeComponent } from './components/nutzer/nutzer-liste/nutzer-liste.component';
import { NutzerDetailsComponent } from './components/nutzer/nutzer-details/nutzer-details.component';
import { HomeComponent } from './components/home/home.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'nutzer', component: NutzerListeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
