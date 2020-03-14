import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { TherapieformDaten } from './../_interface/therapieformDaten.model';
import { TherapieformenService } from './../../../services/therapieformen.service';
import { ErrorHandlerService } from './../../../services/error-handler.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { map } from 'rxjs/operators';

import { SuccessDialogComponent } from './../../dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-therapieformen-bearbeitung',
  templateUrl: './therapieformen-bearbeitung.component.html',
  styleUrls: ['./therapieformen-bearbeitung.component.css']
})
export class TherapieformenBearbeitungComponent implements OnInit {

    public therapieformDaten: TherapieformDaten;
    public therapieformForm: FormGroup;
    private dialogConfig;

    constructor(private therapieformenService: TherapieformenService, private dialog: MatDialog, private errorService: ErrorHandlerService, public dialogRef: MatDialogRef<TherapieformenBearbeitungComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
      this.therapieformForm = new FormGroup({
        kuerzel: new FormControl('', [Validators.required, Validators.maxLength(5)]),
        bezeichnung: new FormControl('', [Validators.required, Validators.maxLength(100)])
      });

      if (this.data.key) {
        this.getTherapieform(this.data.key);
      }

      this.dialogConfig = {
        height: '200px',
        width: '400px',
        disableClose: true,
        data: { }
      }
    }

    private getTherapieform(key: string) {
      this.therapieformenService.getTherapieform(key).snapshotChanges().pipe(
        map(action => {
            const data = action.payload.data() as any;
            return { ...data };
        })
      ).subscribe(res => {
        this.therapieformDaten = res as TherapieformDaten;
        this.therapieformForm.patchValue(this.therapieformDaten);
      });
    }

    public hasError = (controlName: string, errorName: string) =>{
      return this.therapieformForm.controls[controlName].hasError(errorName);
    }

    public onCancel = () => {
        this.dialogRef.close();
    }

    public bearbeiteTherapieform = (therapieformFormValue) => {
      if (this.therapieformForm.valid) {
        this.speichereAenderungen(therapieformFormValue);
      }
    }

    private speichereAenderungen = (therapieformFormValue) => {
      let therapieformDaten: TherapieformDaten = {
        kuerzel: therapieformFormValue.kuerzel,
        bezeichnung: therapieformFormValue.bezeichnung
      }
      if (this.data.key){
          this.therapieformenService.updateTherapieform(this.data.key, therapieformDaten).then(res => {
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
        this.therapieformenService.createTherapieform(therapieformDaten).then(res => {
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
