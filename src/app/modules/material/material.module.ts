import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule,
         MatToolbarModule,
         MatIconModule,
         MatSidenavModule,
         MatListModule,
         MatButtonModule,
         MatMenuModule,
         MatExpansionModule,
         MatTableModule,
         MatSortModule,
         MatFormFieldModule,
         MatInputModule,
         MatPaginatorModule,
         MatCardModule,
         MatSelectModule } from  '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule
  ],
  exports: [
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    MatSelectModule
  ],
  declarations: []
})
export class MaterialModule { }
