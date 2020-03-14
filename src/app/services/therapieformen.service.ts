import { Injectable } from '@angular/core';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from '@angular/fire/firestore';
import { Therapieform } from './../components/therapieformen/_interface/therapieform.model';
import { TherapieformDaten } from './../components/therapieformen/_interface/therapieformDaten.model';

@Injectable({
  providedIn: 'root'
})
export class TherapieformenService {

  private dbPath = '/Therapieformen';

  therapieformenRef: AngularFirestoreCollection<any> = null;

  constructor(private db: AngularFirestore) {
    this.therapieformenRef = db.collection(this.dbPath);
  }

  public createTherapieform = (therapieformDaten: TherapieformDaten) => {
    return this.therapieformenRef.add({...therapieformDaten});
  }

  public updateTherapieform = (key: string, value: any) => {
    return this.therapieformenRef.doc(key).update(value);
  }

  public deleteTherapieform = (key: string) => {
    return this.therapieformenRef.doc(key).delete();
  }

  public getTherapieformenListe = () => {
    return this.therapieformenRef;
  }

  public getTherapieform = (key: string) => {
    return this.therapieformenRef.doc(key);
  }
}
