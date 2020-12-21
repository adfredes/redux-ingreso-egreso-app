import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from '../../shared/ui.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading: boolean = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.createFormGroup();

    this.uiSubscription = this.store.select('ui').subscribe( ui => this.loading = ui.isLoading);
  }

  ngOnDestroy() : void {
    this.uiSubscription.unsubscribe();
  }

  createFormGroup = () : void => {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login = async () => {
    this.loginForm.markAllAsTouched();

    this.store.dispatch(ui.isLoading());

    if(this.loginForm.invalid) { return; }    
    // Swal.fire({
    //   title: 'Espere por favor'
    // });    
    // Swal.showLoading();
    const {correo, password} = this.loginForm.value;

    try {            
      const credenciales = await this.authService.loginUsuario(correo, password);
      // Swal.close();
      this.store.dispatch(ui.stopLoading());      
      this.router.navigate(['/']);      
    } catch (err) {      
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,        
      })      
    }
  }

}
