import { Component, OnInit, Inject } from '@angular/core';
import { NutzerService } from '../../../services/nutzer.service';
import { Nutzer } from './../_interface/nutzer.model';
import { NutzerDaten } from './../_interface/nutzerDaten.model';
import { MatCardModule} from '@angular/material';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-nutzer-details',
  templateUrl: './nutzer-details.component.html',
  styleUrls: ['./nutzer-details.component.css']
})
export class NutzerDetailsComponent implements OnInit {

  public nutzer: Nutzer;

  constructor(private nutzerService: NutzerService, public dialogRef: MatDialogRef<NutzerDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.getNutzer(this.data.key);
  }

  getNutzer(key: string) {
    this.nutzerService.getNutzer(key).snapshotChanges().pipe(
      map(action => {
          const data = action.payload.data() as any;
          const id = action.payload.id;
          return { id, ...data };
      })
    ).subscribe(res => {
      this.nutzer = res as Nutzer;
    });
  }

  public closeDialog = () => {
    this.dialogRef.close();
  }
}
