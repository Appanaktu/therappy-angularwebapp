import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { NutzerDaten } from './../_interface/nutzerDaten.model';
import { NutzerService } from './../../../services/nutzer.service';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { map } from 'rxjs/operators';

import { SuccessDialogComponent } from './../../dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-nutzer-bearbeitung',
  templateUrl: './nutzer-bearbeitung.component.html',
  styleUrls: ['./nutzer-bearbeitung.component.css']
})
export class NutzerBearbeitungComponent implements OnInit {

  public nutzerDaten: NutzerDaten;
  public nutzerForm: FormGroup;
  private dialogConfig;
  constructor(private nutzerService: NutzerService, private dialog: MatDialog, private errorService: ErrorHandlerService, public dialogRef: MatDialogRef<NutzerBearbeitungComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.nutzerForm = new FormGroup({
      vorname: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      nachname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      qualifikation: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      geburtsdatum: new FormControl(new Date(),[Validators.required]),
      strasse: new FormControl('', [Validators.maxLength(100)]),
      hausnummer: new FormControl('', [Validators.maxLength(100)]),
      postleitzahl: new FormControl('', [Validators.maxLength(100)]),
      stadt: new FormControl('', [Validators.maxLength(100)]),
      land: new FormControl('', [Validators.maxLength(100)]),
    });

    if (this.data.key) {
      this.getNutzer(this.data.key);
    }

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: { }
    }
  }

  private getNutzer(key: string) {
    this.nutzerService.getNutzer(key).snapshotChanges().pipe(
      map(action => {
          const data = action.payload.data() as any;
          if (data.geburtsdatum) {
            data.geburtsdatum = data.geburtsdatum.toDate();
          }
          return { ...data };
      })
    ).subscribe(res => {
      this.nutzerDaten = res as NutzerDaten;
      this.nutzerForm.patchValue(this.nutzerDaten);
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.nutzerForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
      this.dialogRef.close();
  }

  public bearbeiteNutzer = (nutzerFormValue) => {
    if (this.nutzerForm.valid) {
      this.speichereAenderungen(nutzerFormValue);
    }
  }

  private speichereAenderungen = (nutzerFormValue) => {
    let nutzerDaten: NutzerDaten = {
      vorname: nutzerFormValue.vorname,
      nachname: nutzerFormValue.nachname,
      qualifikation: nutzerFormValue.qualifikation,
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
        },
        (error => {
          this.errorService.dialogConfig = { ...this.dialogConfig };
          this.errorService.handleFirstoreError("Update fehlgeschlagen");
        })
      );
    }
  }
}
