import { Component, OnInit, Inject } from '@angular/core';
import { NutzerService } from '../../../services/nutzer.service';
import { NutzerDaten } from './../_interface/nutzerDaten.model';

import { Qualifikation } from './../../qualifikationen/_interface/qualifikation.model';
import { QualifikationenService } from '../../../services/qualifikationen.service';

import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-nutzer-details',
  templateUrl: './nutzer-details.component.html',
  styleUrls: ['./nutzer-details.component.css']
})
export class NutzerDetailsComponent implements OnInit {

  public nutzerDaten: NutzerDaten;
  public nutzerForm: FormGroup;
  public qualifikationenList: Qualifikation[]

  constructor(private nutzerService: NutzerService, private qualifikationenService: QualifikationenService, public dialogRef: MatDialogRef<NutzerDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.nutzerForm = new FormGroup({
      vorname: new FormControl({disabled: true}, []),
      nachname: new FormControl('', []),
      qualifikationen: new FormControl('', []),
      geburtsdatum: new FormControl(new Date(),[]),
      strasse: new FormControl('', []),
      hausnummer: new FormControl('', []),
      postleitzahl: new FormControl('', []),
      stadt: new FormControl('', []),
      land: new FormControl('', []),
    });

    this.getNutzer(this.data.key);

    this.getQualifiaktionenListe();
  }

  getNutzer(key: string) {
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

  private getQualifiaktionenListe() {
    this.qualifikationenService.getQualifikationenListe().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(res => {
      this.qualifikationenList = res as Qualifikation[];
    });
  }

  public closeDialog = () => {
    this.dialogRef.close();
  }
}
