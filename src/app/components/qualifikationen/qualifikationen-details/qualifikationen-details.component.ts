import { Component, OnInit, Inject } from '@angular/core';
import { QualifikationenService } from '../../../services/qualifikationen.service';
import { QualifikationDaten } from './../_interface/qualifikationDaten.model';

import { Therapieform } from './../../therapieformen/_interface/therapieform.model';
import { TherapieformenService } from '../../../services/therapieformen.service';

import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-qualifikationen-details',
  templateUrl: './qualifikationen-details.component.html',
  styleUrls: ['./qualifikationen-details.component.css']
})
export class QualifikationenDetailsComponent implements OnInit {

  public qualifikationDaten: QualifikationDaten;
  public qualifikationForm: FormGroup;
  public therapieformenList = new Array();

  constructor(private qualifikationenService: QualifikationenService, private therapieformenService: TherapieformenService, public dialogRef: MatDialogRef<QualifikationenDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.qualifikationForm = new FormGroup({
      kuerzel: new FormControl('', []),
      bezeichnung: new FormControl('', []),
      therapieformen: new FormControl('', [])
    });

    this.getQualifikation(this.data.key);
  }

  getQualifikation(key: string) {
    this.qualifikationenService.getQualifikation(key).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data() as any;
        return { ...data };
      })
    ).subscribe(res => {
      this.qualifikationDaten = res as QualifikationDaten;
      if(this.qualifikationDaten.therapieformen){
        this.getTherapieformenListe();
      };
      this.qualifikationForm.patchValue(this.qualifikationDaten);
      this.qualifikationForm.disable();
    });
  }

  private getTherapieformenListe() {
    this.qualifikationDaten.therapieformen.forEach((therapieform_key) => {
      this.therapieformenService.getTherapieform(therapieform_key).snapshotChanges().pipe(
        map(action => {
          const data = action.payload.data() as any;
          return { ...data };
        })
      ).subscribe(res => {
        this.therapieformenList.push(res.bezeichnung);
      });
    });
  }

  public closeDialog = () => {
    this.dialogRef.close();
  }

}
