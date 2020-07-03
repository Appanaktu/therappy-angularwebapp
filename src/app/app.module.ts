import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, SETTINGS } from '@angular/fire/firestore';

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
import { QualifikationenListeComponent } from './components/qualifikationen/qualifikationen-liste/qualifikationen-liste.component';
import { QualifikationenBearbeitungComponent } from './components/qualifikationen/qualifikationen-bearbeitung/qualifikationen-bearbeitung.component';
import { QualifikationenDetailsComponent } from './components/qualifikationen/qualifikationen-details/qualifikationen-details.component';
import { TherapieformenListeComponent } from './components/therapieformen/therapieformen-liste/therapieformen-liste.component';
import { TherapieformenDetailsComponent } from './components/therapieformen/therapieformen-details/therapieformen-details.component';
import { TherapieformenBearbeitungComponent } from './components/therapieformen/therapieformen-bearbeitung/therapieformen-bearbeitung.component';
import { TermineListeComponent } from './components/termine/termine-liste/termine-liste.component';
import { TermineDetailsComponent } from './components/termine/termine-details/termine-details.component';
import { TermineBearbeitungComponent } from './components/termine/termine-bearbeitung/termine-bearbeitung.component';
import { RegionenListeComponent } from './components/regionen/regionen-liste/regionen-liste.component';
import { RegionenDetailsComponent } from './components/regionen/regionen-details/regionen-details.component';
import { RegionenBearbeitungComponent } from './components/regionen/regionen-bearbeitung/regionen-bearbeitung.component';
import { PflegeheimeListeComponent } from './components/pflegeheime/pflegeheime-liste/pflegeheime-liste.component';
import { PflegeheimeDetailsComponent } from './components/pflegeheime/pflegeheime-details/pflegeheime-details.component';
import { PflegeheimeBearbeitungComponent } from './components/pflegeheime/pflegeheime-bearbeitung/pflegeheime-bearbeitung.component';

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
    NotFoundComponent,
    QualifikationenListeComponent,
    QualifikationenBearbeitungComponent,
    QualifikationenDetailsComponent,
    TherapieformenListeComponent,
    TherapieformenDetailsComponent,
    TherapieformenBearbeitungComponent,
    TermineListeComponent,
    TermineDetailsComponent,
    TermineBearbeitungComponent,
    RegionenListeComponent,
    RegionenDetailsComponent,
    RegionenBearbeitungComponent,
    PflegeheimeListeComponent,
    PflegeheimeDetailsComponent,
    PflegeheimeBearbeitungComponent
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
    NutzerDetailsComponent,
    TermineBearbeitungComponent,
    TermineDetailsComponent,
    QualifikationenBearbeitungComponent,
    QualifikationenDetailsComponent,
    TherapieformenBearbeitungComponent,
    TherapieformenDetailsComponent,
    RegionenBearbeitungComponent,
    RegionenDetailsComponent,
    PflegeheimeBearbeitungComponent,
    PflegeheimeDetailsComponent
  ],
  providers: [{ provide: SETTINGS, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
