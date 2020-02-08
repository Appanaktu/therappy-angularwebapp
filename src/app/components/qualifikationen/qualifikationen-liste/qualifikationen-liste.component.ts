import { Component, OnInit, ViewChild } from '@angular/core';
import { QualifikationenService } from '../../../services/qualifikationen.service';
import { map } from 'rxjs/operators';
import { Qualifikation } from './../_interface/qualifikation.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';

import { QualifikationenBearbeitungComponent } from './../qualifikationen-bearbeitung/qualifikationen-bearbeitung.component';
import { QualifikationenDetailsComponent } from './../qualifikationen-details/qualifikationen-details.component';

@Component({
  selector: 'app-qualifikationen-liste',
  templateUrl: './qualifikationen-liste.component.html',
  styleUrls: ['./qualifikationen-liste.component.css']
})
export class QualifikationenListeComponent implements OnInit {
  public displayedColumns = ['kuerzel', 'bezeichnung','details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Qualifikation>();
  private dialogConfig;

  constructor(private qualifikationenService: QualifikationenService, private dialog: MatDialog) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.getQualifiaktionenListe();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dialogConfig = {
      data: { }
    }
  }

  private getQualifiaktionenListe() {
    this.qualifikationenService.getQualifikationenListe().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(res => {
      this.dataSource.data = res as Qualifikation[];
    });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (key: string) => {
    this.dialogConfig.data = { 'key': key };
    let dialogRef = this.dialog.open(QualifikationenDetailsComponent, this.dialogConfig);
  }

  public redirectToUpdate = (key: string) => {
    this.dialogConfig.data = { 'key': key };
    let dialogRef = this.dialog.open(QualifikationenBearbeitungComponent, this.dialogConfig);
  }

  public redirectToDelete = (key: string) => {
    this.qualifikationenService
      .deleteQualifikation(key)
      .catch(err => console.log(err));
  }

}
