import { Component, OnInit, ViewChild } from '@angular/core';
import { TherapieformenService } from '../../../services/therapieformen.service';
import { map } from 'rxjs/operators';
import { Therapieform } from '../_interface/therapieform.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';

import { TherapieformenBearbeitungComponent } from './../therapieformen-bearbeitung/therapieformen-bearbeitung.component';
import { TherapieformenDetailsComponent } from './../therapieformen-details/therapieformen-details.component';

@Component({
  selector: 'app-therapieformen-liste',
  templateUrl: './therapieformen-liste.component.html',
  styleUrls: ['./therapieformen-liste.component.css']
})
export class TherapieformenListeComponent implements OnInit {
  public displayedColumns = ['kuerzel', 'bezeichnung','details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Therapieform>();
  private dialogConfig;

  constructor(private therapieformenService: TherapieformenService, private dialog: MatDialog) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.getTherapieformenListe();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dialogConfig = {
      data: { }
    }
  }

  private getTherapieformenListe() {
    this.therapieformenService.getTherapieformenListe().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(res => {
      this.dataSource.data = res as Therapieform[];
    });
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToDetails = (key: string) => {
    this.dialogConfig.data = { 'key': key };
    let dialogRef = this.dialog.open(TherapieformenDetailsComponent, this.dialogConfig);
  }

  public redirectToUpdate = (key: string) => {
    this.dialogConfig.data = { 'key': key };
    let dialogRef = this.dialog.open(TherapieformenBearbeitungComponent, this.dialogConfig);
  }

  public redirectToDelete = (key: string) => {
    this.therapieformenService
      .deleteTherapieform(key)
      .catch(err => console.log(err));
  }


}
