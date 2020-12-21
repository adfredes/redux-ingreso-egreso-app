import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as authAction from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription;

  constructor(private auth: AngularFireAuth,
              public firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener = ()  => {
    this.auth.authState.subscribe(fuser => {      
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .pipe(          
          map((user: any) => Usuario.fromFirebase(user))
        )
        .subscribe((user) => {          
          this.store.dispatch(authAction.setUser({user}));          
        });
        
      }
      else{
        this.userSubscription.unsubscribe();
        this.store.dispatch(authAction.unSetUser());
      }          
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
