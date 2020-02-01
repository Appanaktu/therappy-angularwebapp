import { ErstelleNutzerComponent } from './components/nutzer/erstelle-nutzer/erstelle-nutzer.component';
import { NutzerListeComponent } from './components/nutzer/nutzer-liste/nutzer-liste.component';
import { NutzerDetailsComponent } from './components/nutzer/nutzer-details/nutzer-details.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/error-pages/not-found/not-found.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'nutzer', component: NutzerListeComponent },
  { path: 'nutzer/bearbeiten', component: ErstelleNutzerComponent },
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
