import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

import { NutzerDetailsComponent } from './components/nutzer/nutzer-details/nutzer-details.component';
import { NutzerListeComponent } from './components/nutzer/nutzer-liste/nutzer-liste.component';
import { NutzerBearbeitungComponent } from './components/nutzer/nutzer-bearbeitung/nutzer-bearbeitung.component';
import { HeaderComponent } from './components/navigation/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { SidenavListComponent } from './components/navigation/sidenav-list/sidenav-list.component';
import { FooterComponent } from './components/navigation/footer/footer.component';
import { SuccessDialogComponent } from './components/dialogs/success-dialog/success-dialog.component';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { NotFoundComponent } from './components/error-pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NutzerDetailsComponent,
    NutzerListeComponent,
    NutzerBearbeitungComponent,
    HeaderComponent,
    LayoutComponent,
    HomeComponent,
    SidenavListComponent,
    FooterComponent,
    SuccessDialogComponent,
    ErrorDialogComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    SuccessDialogComponent,
    ErrorDialogComponent,
    NutzerBearbeitungComponent,
    NutzerDetailsComponent
  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
