import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { QualifikationDaten } from './../_interface/qualifikationDaten.model';
import { QualifikationenService } from './../../../services/qualifikationen.service';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { map } from 'rxjs/operators';

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

  constructor(private qualifikationenService: QualifikationenService, private dialog: MatDialog, private errorService: ErrorHandlerService, public dialogRef: MatDialogRef<QualifikationenBearbeitungComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.qualifikationForm = new FormGroup({
      kuerzel: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      bezeichnung: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    });

    if (this.data.key) {
      this.getQualifikation(this.data.key);
    }

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: { }
    }
  }

  private getQualifikation(key: string) {
    this.qualifikationenService.getQualifikation(key).snapshotChanges().pipe(
      map(action => {
          const data = action.payload.data() as any;
          return { ...data };
      })
    ).subscribe(res => {
      this.qualifikationDaten = res as QualifikationDaten;
      this.qualifikationForm.patchValue(this.qualifikationDaten);
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.qualifikationForm.controls[controlName].hasError(errorName);
  }

  public onCancel = () => {
      this.dialogRef.close();
  }

  public bearbeiteQualifikaion = (qualifikationFormValue) => {
    if (this.qualifikationForm.valid) {
      this.speichereAenderungen(qualifikationFormValue);
    }
  }

  private speichereAenderungen = (qualifikationFormValue) => {
    let qualifikationDaten: QualifikationDaten = {
      kuerzel: qualifikationFormValue.kuerzel,
      bezeichnung: qualifikationFormValue.bezeichnung,
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
      this.qualifikationenService.createQualifikaion(qualifikationDaten).then(res => {
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
