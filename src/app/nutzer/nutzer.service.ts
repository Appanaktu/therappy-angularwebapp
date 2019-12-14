import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Nutzer } from './nutzer';

@Injectable({
  providedIn: 'root'
})
export class NutzerService {

  private dbPath = '/Nutzer';
 
  nutzerRef: AngularFirestoreCollection<Nutzer> = null;
 
  constructor(private db: AngularFirestore) {
    this.nutzerRef = db.collection(this.dbPath);
  }
 
  createNutzer(nutzer: Nutzer): void {
    this.nutzerRef.add({...nutzer});
  }
 
  updateNutzer(key: string, value: any): Promise<void> {
    return this.nutzerRef.doc(key).update(value);
  }
 
  deleteNutzer(key: string): Promise<void> {
    return this.nutzerRef.doc(key).delete();
  }
 
  getNutzerListe(): AngularFirestoreCollection<Nutzer> {
    return this.nutzerRef;
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
