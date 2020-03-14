import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog,  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

import { Qualifikation } from './../../qualifikationen/_interface/qualifikation.model';
import { QualifikationenService } from '../../../services/qualifikationen.service';

import { NutzerDaten } from './../_interface/nutzerDaten.model';
import { NutzerService } from './../../../services/nutzer.service';

import { ErrorHandlerService } from './../../../services/error-handler.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { SuccessDialogComponent } from './../../dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-nutzer-bearbeitung',
  templateUrl: './nutzer-bearbeitung.component.html',
  styleUrls: ['./nutzer-bearbeitung.component.css']
})
export class NutzerBearbeitungComponent implements OnInit {

  ////////////////////////////////////////////////////////////////////////////
  // Allgemeine Variablen
  ////////////////////////////////////////////////////////////////////////////
  // Nutzerdaten in denen die Inforamtionen aus dem Cloud-Firestore gespeichert werden
  public nutzerDaten: NutzerDaten;

  // FromGroup umfasst alle Formular-Felder der Ansicht und führt vordefinierte Feldprüfungen druch
  public nutzerForm: FormGroup;

  // Default-Variable für den Aufruf eines Subdialogs
  private dialogConfig;

  ////////////////////////////////////////////////////////////////////////////
  // Initialisierung
  ////////////////////////////////////////////////////////////////////////////
  constructor(private nutzerService: NutzerService, private qualifikationenService: QualifikationenService, private dialog: MatDialog, private errorService: ErrorHandlerService, public dialogRef: MatDialogRef<NutzerBearbeitungComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // Anlage der Unterschiedlichen Felder und Prüfungen in der FromGroup
    this.nutzerForm = new FormGroup({
      vorname: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      nachname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      qualifikationen: new FormControl('', [Validators.required]),
      geburtsdatum: new FormControl(new Date(),[Validators.required]),
      strasse: new FormControl('', [Validators.maxLength(100)]),
      hausnummer: new FormControl('', [Validators.maxLength(100)]),
      postleitzahl: new FormControl('', [Validators.maxLength(100)]),
      stadt: new FormControl('', [Validators.maxLength(100)]),
      land: new FormControl('', [Validators.maxLength(100)]),
    });

    // Lesen Daten aus dem Firestore
    this.getFirestoredaten();

    // Verknüpfung der gefiltereten Qualifikationen mit dem valueChange-Obervable mit dem Qualifikationeingabe-Formularfelds
    this.gefilterteQualifikationen = this.qualifikationCtrl.valueChanges.pipe(
      startWith(null),
      map((filterText: string | null) => filterText ? this._filter(filterText) : this.qualifikationVorschlagsliste.slice())
    );

    // Verknüpfung der ausgewaehlten Qualifikationen mit dem valueChanges-Observable des qualifikationen-Formularfelds
    this.ausgewaehlteQualifikationen = this.nutzerForm.get('qualifikationen').valueChanges.pipe(
      startWith(null),
      map((qualifikationen: string[] | null) => qualifikationen ? this.erstelleAusgewaehlteQualifikationen(qualifikationen) : [])
    );

    // Festlegung allgemeiner Parameter für den Aufbau von Subdialogen
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
    this.getQualifikationen().subscribe(res => {
      this.qualifikationenList = res as Qualifikation[];
      // wenn this.data.key gefüllt ist wurde eine eindeutige Nutzer-ID beim Aufruf der Seite
      // mitgegeben und damit in die Änderung dieses Nutzers eingetiegen, somit müssen die Nutzerdaten
      // zunächst ermittelte werden
      //
      // getNutzer wird im Anschluss an getQualifikationen aufgerufen, weil der korrekte Aufbau
      // der Nutzerdaten erforder, dass die Qualifikationsdaten bekannt sind. Da alle Aufrufe Richtung
      // Firestore asynchrone sind kann nur über den subscribe sichergestellt werden, dass dies so ist
      if (this.data.key) {
        this.getNutzer(this.data.key).subscribe(res => {
          // Fülle Nutzerdaten
          this.nutzerDaten = res as NutzerDaten;

          // Fülle die Formularfelder aus den Nutzerdaten
          this.nutzerForm.patchValue(this.nutzerDaten);
        });
      }
    });
  }

  // Qualifiaktionslesen
  private getQualifikationen () {
    return this.qualifikationenService.getQualifikationenListe().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    )
  }

  // Nutzerlesen
  private getNutzer(key: string) {
    return this.nutzerService.getNutzer(key).snapshotChanges().pipe(
      map(action => {
          const data = action.payload.data() as any;
          if (data.geburtsdatum) {
            data.geburtsdatum = data.geburtsdatum.toDate();
          }
          return { ...data };
      })
    )
  }

  ////////////////////////////////////////////////////////////////////////////
  // Qualifikationsbearbeitung
  ////////////////////////////////////////////////////////////////////////////
  // Liste in der alle im Cloud-Firestore bekannten Qualifikationen gespeichert werden
  public qualifikationenList: Qualifikation[] = [];

  // Unterschiedliche interne Qualifikationslisten für die Anzeige und Auswahl der verschiedenen Qualifikationen
  gefilterteQualifikationen: Observable<Qualifikation[]>;
  qualifikationVorschlagsliste: Qualifikation[] = [];
  ausgewaehlteQualifikationen: Observable<Qualifikation[]>;

  // FromControl-Variable für die eingabe von Qualifikationen
  qualifikationCtrl = new FormControl();

  // Variable für die Festlegung der Löschbarkeit der verschiedenen ausgewälten Chips
  removable = true;

  // Zugriff auf das input-Feld bei der Qualifikationseingabe
  @ViewChild('qualifikationInput', {static: true}) qualifikationInput: ElementRef<HTMLInputElement>;

  // Zugriff auf die Autocomplete-Komponente bei der Qualifikationseingabe
  @ViewChild('auto', {static: true}) matAutocomplete: MatAutocomplete;

  // 
  remove(qualifikation: Qualifikation): void {
    var aktuelleQualifikationen = this.nutzerForm.value.qualifikationen;
    const index2 = aktuelleQualifikationen.indexOf(qualifikation.key);
    if (index2 >= 0) {
      aktuelleQualifikationen.splice(index2, 1);
    };
    this.nutzerForm.patchValue({qualifikationen : aktuelleQualifikationen});
    this.erstelleVorschlagsliste();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    var aktuelleQualifikationen = [];
    if (typeof this.nutzerForm.value.qualifikationen == 'string') {
      aktuelleQualifikationen = [event.option.value.key]
    } else {
      aktuelleQualifikationen = this.nutzerForm.value.qualifikationen;
      aktuelleQualifikationen.push(event.option.value.key);
    }
    this.nutzerForm.patchValue({qualifikationen : aktuelleQualifikationen});
    this.erstelleVorschlagsliste();
    this.qualifikationInput.nativeElement.value = '';
    this.qualifikationCtrl.setValue(null);
  }

  private erstelleVorschlagsliste(){
    this.qualifikationVorschlagsliste = this.qualifikationenList.filter(qualifikation => this.nutzerForm.value.qualifikationen.indexOf(qualifikation.key) < 0);
  }

  private erstelleAusgewaehlteQualifikationen(qualifikationen: string[]): Qualifikation[] {
    return this.qualifikationenList.filter(qualifikation => qualifikationen.indexOf(qualifikation.key) >= 0);
  }

  private _filter(value: string | Qualifikation): Qualifikation[] {
    var filterValue = '';
    if ( typeof value === 'string' ){
      filterValue = value.toLowerCase();
    } else {
      filterValue = '';
    };
    this.erstelleVorschlagsliste();
    return this.qualifikationVorschlagsliste.filter((qualifikation:Qualifikation) => qualifikation['bezeichnung'].toLowerCase().indexOf(filterValue) === 0);
  }

  ////////////////////////////////////////////////////////////////////////////
  // Bearbeitungsspeicherung
  ////////////////////////////////////////////////////////////////////////////
  public bearbeiteNutzer = (nutzerFormValue) => {
    if (this.nutzerForm.valid) {
      this.speichereAenderungen(nutzerFormValue);
    }
  }

  private speichereAenderungen = (nutzerFormValue) => {
    let nutzerDaten: NutzerDaten = {
      vorname: nutzerFormValue.vorname,
      nachname: nutzerFormValue.nachname,
      qualifikationen: nutzerFormValue.qualifikationen,
      geburtsdatum: nutzerFormValue.geburtsdatum,
      strasse: nutzerFormValue.strasse,
      hausnummer: nutzerFormValue.hausnummer,
      postleitzahl: nutzerFormValue.postleitzahl,
      stadt: nutzerFormValue.stadt,
      land: nutzerFormValue.land
    }
    if (this.data.key){
        this.nutzerService.updateNutzer(this.data.key, nutzerDaten).then(res => {
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
      this.nutzerService.createNutzer(nutzerDaten).then(res => {
          let dialogRef2 = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

          //hier wird das [mat-dialog-close] Attribut subscribed, welches am dialog button hängt
          dialogRef2.afterClosed()
          .subscribe(result => {
            this.dialogRef.close();
          });
        }
      )
      .catch( error => {
        this.errorService.dialogConfig = { ...this.dialogConfig };
        this.errorService.handleFirstoreError("Update fehlgeschlagen");
      });
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
    return this.nutzerForm.controls[controlName].hasError(errorName);
  }

}
