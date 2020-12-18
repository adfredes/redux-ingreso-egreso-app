import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, public firestore: AngularFirestore) { }

  initAuthListener = ()  => {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
    });
  }

  crearUsuario = async (nombre: string, email: string, password: string) => {    
      const {user} = await this.auth.createUserWithEmailAndPassword(email, password);
      const newUser = new Usuario(user.uid, nombre, email);
      return this.firestore.doc(`${user.uid}/usuario`)
        .set({...newUser})    
  };

  loginUsuario = (email: string, password: string) => this.auth.signInWithEmailAndPassword(email, password);

  logout = ()  => this.auth.signOut();

  isAuth() {
    return this.auth.authState
              .pipe(
                map(fuser => fuser !== null)
              );
  }

}
