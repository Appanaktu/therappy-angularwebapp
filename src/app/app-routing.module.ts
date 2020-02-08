import { NutzerListeComponent } from './components/nutzer/nutzer-liste/nutzer-liste.component';
import { TermineListeComponent } from './components/termine/termine-liste/termine-liste.component';
import { QualifikationenListeComponent } from './components/qualifikationen/qualifikationen-liste/qualifikationen-liste.component';
import { TherapieformenListeComponent } from './components/therapieformen/therapieformen-liste/therapieformen-liste.component';
import { RegionenListeComponent } from './components/regionen/regionen-liste/regionen-liste.component';
import { PflegeheimeListeComponent } from './components/pflegeheime/pflegeheime-liste/pflegeheime-liste.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/error-pages/not-found/not-found.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'nutzer', component: NutzerListeComponent },
  { path: 'termine', component: TermineListeComponent },
  { path: 'qualifikationen', component: QualifikationenListeComponent },
  { path: 'therapieformen', component: TherapieformenListeComponent },
  { path: 'regionen', component: RegionenListeComponent },
  { path: 'pflegeheime', component: PflegeheimeListeComponent },
  { path: '404', component: NotFoundComponent},
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
