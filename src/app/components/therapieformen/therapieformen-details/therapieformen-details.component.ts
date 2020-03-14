import { Component, OnInit, Inject } from '@angular/core';
import { TherapieformenService } from '../../../services/therapieformen.service';
import { TherapieformDaten } from './../_interface/therapieformDaten.model';

import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-therapieformen-details',
  templateUrl: './therapieformen-details.component.html',
  styleUrls: ['./therapieformen-details.component.css']
})
export class TherapieformenDetailsComponent implements OnInit {

    public therapieformDaten: TherapieformDaten;
    public therapieformForm: FormGroup;

    constructor(private therapieformenService: TherapieformenService, public dialogRef: MatDialogRef<TherapieformenDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
      this.therapieformForm = new FormGroup({
        kuerzel: new FormControl('', []),
        bezeichnung: new FormControl('', []),
      });

      this.getTherapieform(this.data.key);
    }

    getTherapieform(key: string) {
      this.therapieformenService.getTherapieform(key).snapshotChanges().pipe(
        map(action => {
          const data = action.payload.data() as any;
          return { ...data };
        })
      ).subscribe(res => {
        this.therapieformDaten = res as TherapieformDaten;
        this.therapieformForm.patchValue(this.therapieformDaten);
        this.therapieformForm.disable();
      });
    }

    public closeDialog = () => {
      this.dialogRef.close();
    }

}
