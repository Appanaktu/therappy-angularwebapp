import { Component, OnInit, ViewChild } from '@angular/core';
import { NutzerService } from '../../../services/nutzer.service';
import { map } from 'rxjs/operators';
import { Nutzer } from './../nutzer';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { MatSort } from '@angular/material/sort';

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

  constructor(private nutzerService: NutzerService ) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.getNutzerListe();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
    if (this.showDetails == '') {
      this.showDetails = 'show';
      this.currentKey = key;
      this.showUpdate = ''

    } else {
      this.showDetails = ''
      this.currentKey = '';
    };
  }

  public redirectToUpdate = (key: string) => {
    if (this.showUpdate == '') {
      this.showUpdate = 'show';
      this.showDetails = ''

    } else {
      this.showUpdate = ''
    };
  }

  public redirectToDelete = (key: string) => {
    this.nutzerService
      .deleteNutzer(key)
      .catch(err => console.log(err));
  }
}
