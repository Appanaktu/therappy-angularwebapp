import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Nutzer } from './../nutzer';
import { NutzerService } from './../../../services/nutzer.service';
import { ErrorHandlerService } from './../../../services/error-handler.service';

import { SuccessDialogComponent } from './../../dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-erstelle-nutzer',
  templateUrl: './erstelle-nutzer.component.html',
  styleUrls: ['./erstelle-nutzer.component.css']
})
export class ErstelleNutzerComponent implements OnInit {

  public nutzerForm: FormGroup;
  private dialogConfig;

  constructor(private location: Location, private nutzerService: NutzerService, private dialog: MatDialog, private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.nutzerForm = new FormGroup({
      vorname: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      nachname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      // dateOfBirth: new FormControl(new Date()),
      qualifikation: new FormControl('', [Validators.required, Validators.maxLength(100)])
    });

    this.dialogConfig = {
      height: '200px',
      width: '400px',
      disableClose: true,
      data: { }
    }
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.nutzerForm.controls[controlName].hasError(errorName);
  }

  public bearbeiteNutzer = (nutzerFormValue) => {
    if (this.nutzerForm.valid) {
      this.speichereAenderungen(nutzerFormValue);
    }
  }

  private speichereAenderungen = (nutzerFormValue) => {
    let nutzer: Nutzer = {
      vorname: nutzerFormValue.vorname,
      nachname: nutzerFormValue.nachname,
      qualifikation: nutzerFormValue.qualifikation
    }
    this.nutzerService.createNutzer(nutzer).then(res => {
      let dialogRef = this.dialog.open(SuccessDialogComponent, this.dialogConfig);

      //hier wird das [mat-dialog-close] Attribut subscribed, welches am dialog button hängt
      dialogRef.afterClosed()
        .subscribe(result => {
          this.location.back();
        });
      },
      (error => {
        this.errorService.dialogConfig = { ...this.dialogConfig };
        this.errorService.handleFirstoreError("Update fehlgeschlagen");
      })
    );
  }
}
