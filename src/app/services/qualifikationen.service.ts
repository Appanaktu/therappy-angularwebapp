import { Injectable } from '@angular/core';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from '@angular/fire/firestore';
import { Qualifikation } from './../components/qualifikationen/_interface/qualifikation.model';
import { QualifikationDaten } from './../components/qualifikationen/_interface/qualifikationDaten.model';

@Injectable({
  providedIn: 'root'
})
export class QualifikationenService {

  private dbPath = '/Qualifikationen';

  qualifikationenRef: AngularFirestoreCollection<any> = null;

  constructor(private db: AngularFirestore) {
    this.qualifikationenRef = db.collection(this.dbPath);
  }

  public createQualifikaion = (qualifikationDaten: QualifikationDaten) => {
    return this.qualifikationenRef.add({...qualifikationDaten});
  }

  public updateQualifikation = (key: string, value: any) => {
    return this.qualifikationenRef.doc(key).update(value);
  }

  public deleteQualifikation = (key: string) => {
    return this.qualifikationenRef.doc(key).delete();
  }

  public getQualifikationenListe = () => {
    return this.qualifikationenRef;
  }

  public getQualifikation = (key: string) => {
    return this.qualifikationenRef.doc(key);
  }
}
