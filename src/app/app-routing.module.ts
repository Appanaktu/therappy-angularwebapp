import { ErstelleNutzerComponent } from './nutzer/erstelle-nutzer/erstelle-nutzer.component';
import { NutzerListeComponent } from './nutzer/nutzer-liste/nutzer-liste.component';
 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
const routes: Routes = [
  { path: '', redirectTo: 'nutzer', pathMatch: 'full' },
  { path: 'nutzer', component: NutzerListeComponent },
  { path: 'add', component: ErstelleNutzerComponent }
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
