import { Component, OnInit, ViewChild } from '@angular/core';
import { NutzerService } from '../../../services/nutzer.service';
import { map } from 'rxjs/operators';
import { Nutzer } from './../_interface/nutzer.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material';

import { NutzerBearbeitungComponent } from './../nutzer-bearbeitung/nutzer-bearbeitung.component';
import { NutzerDetailsComponent } from './../nutzer-details/nutzer-details.component';

@Component({
  selector: 'app-nutzer-liste',
  templateUrl: './nutzer-liste.component.html',
  styleUrls: ['./nutzer-liste.component.css']
})
export class NutzerListeComponent implements OnInit {
  public showUpdate = '';
  public showDetails = '';
  public currentKey = '';
  public displayedColumns = ['vorname', 'nachname', 'qualifikation','details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Nutzer>();
  private dialogConfig;

  constructor(private nutzerService: NutzerService, private dialog: MatDialog ) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.getNutzerListe();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dialogConfig = {
      data: { }
    }
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

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (key: string) => {
    this.dialogConfig.data = { 'key': key };
    let dialogRef = this.dialog.open(NutzerDetailsComponent, this.dialogConfig);
  }

  public redirectToUpdate = (key: string) => {
    this.dialogConfig.data = { 'key': key };
    let dialogRef = this.dialog.open(NutzerBearbeitungComponent, this.dialogConfig);
  }

  public redirectToDelete = (key: string) => {
    this.nutzerService
      .deleteNutzer(key)
      .catch(err => console.log(err));
  }
}
