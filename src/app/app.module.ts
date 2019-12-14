import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NutzerDetailsComponent } from './nutzer/nutzer-details/nutzer-details.component';
import { NutzerListeComponent } from './nutzer/nutzer-liste/nutzer-liste.component';
import { ErstelleNutzerComponent } from './nutzer/erstelle-nutzer/erstelle-nutzer.component';

@NgModule({
  declarations: [
    AppComponent,
    NutzerDetailsComponent,
    NutzerListeComponent,
    ErstelleNutzerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
