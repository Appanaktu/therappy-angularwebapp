import { Component, OnInit } from '@angular/core';
import { NutzerService } from '../nutzer.service';
import { map } from 'rxjs/operators';
import { Nutzer } from './../nutzer';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-nutzer-liste',
  templateUrl: './nutzer-liste.component.html',
  styleUrls: ['./nutzer-liste.component.css']
})
export class NutzerListeComponent implements OnInit {

  public displayedColumns = ['vorname', 'nachname', 'qualifikation','details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Nutzer>();

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
    ).subscribe(res => {
      this.dataSource.data = res as Nutzer[];
    });
  }

  deleteNutzer() {
    this.nutzerService.deleteAll();
  }

  public redirectToDetails = (id: string) => {

  }

  public redirectToUpdate = (id: string) => {

  }

  public redirectToDelete = (id: string) => {

  }
}
