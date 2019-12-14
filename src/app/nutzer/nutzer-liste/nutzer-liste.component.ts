import { Component, OnInit } from '@angular/core';
import { NutzerService } from '../nutzer.service';
import { map } from 'rxjs/operators';
 
@Component({
  selector: 'app-nutzer-liste',
  templateUrl: './nutzer-liste.component.html',
  styleUrls: ['./nutzer-liste.component.css']
})
export class NutzerListeComponent implements OnInit {
 
  nutzerListe: any;
 
  constructor(private nutzerService: NutzerService) { }
 
  ngOnInit() {
    this.getNutzerListe();
  }
 
  getNutzerListe() {
    this.nutzerService.getNutzerListe().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(nutzer => {
      this.nutzerListe = nutzer;
    });
  }
 
  deleteNutzer() {
    this.nutzerService.deleteAll();
  }
 
}
