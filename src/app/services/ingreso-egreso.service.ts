import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  crearIngresoEgreso = (ingresoEgreso: IngresoEgreso) =>{        
    delete ingresoEgreso.uid;
    return this.firestore.doc(`${this.authService.user.uid}/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso});     
  }
  
  initIngresosEgresosListener = (uid: string) =>     
    this.firestore.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snap => snap.map( s => ({
            uid: s.payload.doc.id,
            ...s.payload.doc.data() as any          
            })
          )
        )          
      );

  borrarIngresoEgreso = (uid: string) => 
    this.firestore.doc(`${this.authService.user.uid}/ingresos-egresos/items/${uid}`)
      .delete();
  
  
}
