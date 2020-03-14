import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

import { QualifikationDaten } from './../_interface/qualifikationDaten.model';
import { QualifikationenService } from './../../../services/qualifikationen.service';

import { Therapieform } from './../../therapieformen/_interface/therapieform.model';
import { TherapieformenService } from '../../../services/therapieformen.service';

import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SuccessDialogComponent } from './../../dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-qualifikationen-bearbeitung',
  templateUrl: './qualifikationen-bearbeitung.component.html',
  styleUrls: ['./qualifikationen-bearbeitung.component.css']
})
export class QualifikationenBearbeitungComponent implements OnInit {

  public qualifikationDaten: QualifikationDaten;
  public qualifikationForm: FormGroup;
  private dialogConfig;

  constructor(private qualifikationenService: QualifikationenService, private therapieformenService: TherapieformenService, private dialog: MatDialog, private errorService: ErrorHandlerService, public dialogRef: MatDialogRef<QualifikationenBearbeitungComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.qualifikationForm = new FormGroup({
      kuerzel: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      bezeichnung: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      therapieformen: new FormControl('', [Validators.required])
    });

    // Lesen Daten aus dem Firestore
    this.getFirestoredaten();

    // Verknüpfung der gefiltereten Therapieformen mit dem valueChange-Obervable mit dem Therapieformeingabe-Formularfelds
    this.gefilterteTherapieformen = this.therapieformCtrl.valueChanges.pipe(
      startWith(null),
      map((filterText: string | null) => filterText ? this._filter(filterText) : this.therapieformVorschlagsliste.slice())
    );

    // Verknüpfung der ausgewaehlten Therapieformen mit dem valueChanges-Observable des therapieformen-Formularfelds
    this.ausgewaehlteTherapieformen = this.qualifikationForm.get('therapieformen').valueChanges.pipe(
      startWith(null),
      map((therapieformen: string[] | null) => therapieformen ? this.erstelleAusgewaehlteTherapieformen(therapieformen) : [])
    );

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: { }
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Datenermittlung
  ////////////////////////////////////////////////////////////////////////////
  private getFirestoredaten() {
    this.getTherapieformen().subscribe(res => {
      this.therapieformenList = res as Therapieform[];
      // wenn this.data.key gefüllt ist wurde eine eindeutige Nutzer-ID beim Aufruf der Seite
      // mitgegeben und damit in die Änderung dieses Nutzers eingetiegen, somit müssen die Nutzerdaten
      // zunächst ermittelte werden
      //
      // getQualifikation wird im Anschluss an getTherapieformen aufgerufen, weil der korrekte Aufbau
      // der Qualifikationdaten erforder, dass die Therapieformsdaten bekannt sind. Da alle Aufrufe Richtung
      // Firestore asynchrone sind kann nur über den subscribe sichergestellt werden, dass dies so ist
      //
      // Bei besseren Ideen gerne anpassen
      if (this.data.key) {
        this.getQualifikation(this.data.key).subscribe(res => {
          // Fülle Qualifikationdaten
          this.qualifikationDaten = res as QualifikationDaten;

          // Fülle die Formularfelder aus den Qualifikationdaten
          this.qualifikationForm.patchValue(this.qualifikationDaten);
        });
      }
    });
  }

  // Therapieformlesen
  private getTherapieformen () {
    return this.therapieformenService.getTherapieformenListe().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    )
  }

  // Qualifikationlesen
  private getQualifikation(key: string) {
    return this.qualifikationenService.getQualifikation(key).snapshotChanges().pipe(
      map(action => {
          const data = action.payload.data() as any;
          return { ...data };
      })
    )
  }

  ////////////////////////////////////////////////////////////////////////////
  // Therapieformsbearbeitung
  ////////////////////////////////////////////////////////////////////////////
  // Liste in der alle im Cloud-Firestore bekannten Therapieformen gespeichert werden
  public therapieformenList: Therapieform[] = [];

  // Unterschiedliche interne Therapieformslisten für die Anzeige und Auswahl der verschiedenen Therapieformen
  gefilterteTherapieformen: Observable<Therapieform[]>;
  therapieformVorschlagsliste: Therapieform[] = [];
  ausgewaehlteTherapieformen: Observable<Therapieform[]>;

  // FromControl-Variable für die eingabe von Therapieformen
  therapieformCtrl = new FormControl();

  // Variable für die Festlegung der Löschbarkeit der verschiedenen ausgewälten Chips
  removable = true;

  // Zugriff auf das input-Feld bei der Therapieformseingabe
  @ViewChild('therapieformInput', {static: true}) therapieformInput: ElementRef<HTMLInputElement>;

  // Zugriff auf die Autocomplete-Komponente bei der Therapieformseingabe
  @ViewChild('auto', {static: true}) matAutocomplete: MatAutocomplete;

  // Löschen einer Therapieform
  remove(therapieform: Therapieform): void {

    // Ermittle die Liste aller Therapieformen aus dem Formularfeld "therapieformen"
    var aktuelleTherapieformen = this.qualifikationForm.value.therapieformen;

    // Ermittle den index der zu löschenden Therapieform und entfernde diesen
    const index2 = aktuelleTherapieformen.indexOf(therapieform.key);
    if (index2 >= 0) {
      aktuelleTherapieformen.splice(index2, 1);
    };

    // Aktualisiere die Daten im Formularfeld dadruch wird über die Verknüpfung mit Observable
    // die Liste "ausgewaehlteTherapieformen" ebenfalls aktualisiert
    this.qualifikationForm.patchValue({therapieformen : aktuelleTherapieformen});

    // Baue die Vorschlagsliste neu auf evtl. zukünftig auch über Obervable zu lösen
    this.erstelleVorschlagsliste();
  }

  // Therapieform hinzufügen
  selected(event: MatAutocompleteSelectedEvent): void {
    var aktuelleTherapieformen = [];

    // Prüfe, ob bereits Therapieformen vorhanden sind, wenn ja erweitere die Liste,
    // wenn nein erstelle eine neue Liste
    if (typeof this.qualifikationForm.value.therapieformen == 'string') {
      aktuelleTherapieformen = [event.option.value.key]
    } else {
      aktuelleTherapieformen = this.qualifikationForm.value.therapieformen;
      aktuelleTherapieformen.push(event.option.value.key);
    }

    // Aktualisiere die Daten im Formularfeld dadruch wird über die Verknüpfung mit Observable
    // die Liste "ausgewaehlteTherapieformen" ebenfalls aktualisiert
    this.qualifikationForm.patchValue({therapieformen : aktuelleTherapieformen});

    // Baue die Vorschlagsliste neu auf evtl. zukünftig auch über Obervable zu lösen
    this.erstelleVorschlagsliste();

    // Setze das Eingabefeld der Therapieformen zurück
    this.therapieformInput.nativeElement.value = '';
    this.therapieformCtrl.setValue(null);
  }

  // Erstelle eine Liste der ausgewählten Qualifiaktionen
  private erstelleAusgewaehlteTherapieformen(therapieformen: string[]): Therapieform[] {
    return this.therapieformenList.filter(therapieform => therapieformen.indexOf(therapieform.key) >= 0);
  }

  // Erstelle eine Liste an möglichen Therapieformsvorschlägen ohne die bereits ausgewählten Therapieformen
  private erstelleVorschlagsliste(){
    this.therapieformVorschlagsliste = this.therapieformenList.filter(therapieform => this.qualifikationForm.value.therapieformen.indexOf(therapieform.key) < 0);
  }

  // Filtere die Vorschlagsliste mit Hilfe der Therapieformsbezeichnungen und eines eingegebenen Strings
  private _filter(value: string | Therapieform): Therapieform[] {
    var filterValue = '';
    if ( typeof value === 'string' ){
      filterValue = value.toLowerCase();
    } else {
      filterValue = '';
    };
    this.erstelleVorschlagsliste();
    return this.therapieformVorschlagsliste.filter((therapieform:Therapieform) => therapieform['bezeichnung'].toLowerCase().indexOf(filterValue) === 0);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Bearbeitungsspeicherung
  ////////////////////////////////////////////////////////////////////////////

  public bearbeiteQualifikation = (qualifikationFormValue) => {
    if (this.qualifikationForm.valid) {
      this.speichereAenderungen(qualifikationFormValue);
    }
  }

  private speichereAenderungen = (qualifikationFormValue) => {
    let qualifikationDaten: QualifikationDaten = {
      kuerzel: qualifikationFormValue.kuerzel,
      bezeichnung: qualifikationFormValue.bezeichnung,
      therapieformen: qualifikationFormValue.therapieformen
    }
    if (this.data.key){
        this.qualifikationenService.updateQualifikation(this.data.key, qualifikationDaten).then(res => {
          let dialogRef2 = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

          //hier wird das [mat-dialog-close] Attribut subscribed, welches am dialog button hängt
          dialogRef2.afterClosed()
          .subscribe(result => {
            this.dialogRef.close();
          });
        },
        (error => {
          this.errorService.dialogConfig = { ...this.dialogConfig };
          this.errorService.handleFirstoreError("Update fehlgeschlagen");
        })
      );
    } else {
      this.qualifikationenService.createQualifikation(qualifikationDaten).then(res => {
          let dialogRef2 = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

          //hier wird das [mat-dialog-close] Attribut subscribed, welches am dialog button hängt
          dialogRef2.afterClosed()
          .subscribe(result => {
            this.dialogRef.close();
          });
        },
        (error => {
          this.errorService.dialogConfig = { ...this.dialogConfig };
          this.errorService.handleFirstoreError("Update fehlgeschlagen");
        })
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  // Bearbeitungsabbruchhandling
  ////////////////////////////////////////////////////////////////////////////
  public onCancel = () => {
    this.dialogRef.close();
  }

  ////////////////////////////////////////////////////////////////////////////
  // Fehlerhandling
  ////////////////////////////////////////////////////////////////////////////
  public hasError = (controlName: string, errorName: string) =>{
    return this.qualifikationForm.controls[controlName].hasError(errorName);
  }

}
