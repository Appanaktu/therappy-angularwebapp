import { Injectable } from '@angular/core';
import { AngularFirestore,
         AngularFirestoreCollection,
         AngularFirestoreDocument } from '@angular/fire/firestore';
import { Nutzer } from './../components/nutzer/_interface/nutzer.model';
import { NutzerDaten } from './../components/nutzer/_interface/nutzerDaten.model';

@Injectable({
  providedIn: 'root'
})
export class NutzerService {

  private dbPath = '/Nutzer';

  nutzerRef: AngularFirestoreCollection<any> = null;

  constructor(private db: AngularFirestore) {
    this.nutzerRef = db.collection(this.dbPath);
  }

  public createNutzer = (nutzerDaten: NutzerDaten) => {
    return this.nutzerRef.add({...nutzerDaten});
  }

  public updateNutzer = (key: string, value: any) => {
    return this.nutzerRef.doc(key).update(value);
  }

  deleteNutzer(key: string): Promise<void> {
    return this.nutzerRef.doc(key).delete();
  }

  getNutzerListe(): AngularFirestoreCollection<Nutzer> {
    return this.nutzerRef;
  }

  getNutzer(key: string): AngularFirestoreDocument<Nutzer> {
    return this.nutzerRef.doc(key);
  }

  deleteAll() {
    this.nutzerRef.get().subscribe(
      querySnapshot => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      },
      error => {
        console.log('Error: ', error);
      });
  }
}
