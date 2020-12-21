import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import * as ui from 'src/app/shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  loading: boolean = false;
  private uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.createForm();
    this.uiSubscription = this.store.select('ui').subscribe(({isLoading}) => this.loading = isLoading);
    
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  createForm = () => 
  this.registroForm = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  crearUsuario = async () => {
    this.registroForm.markAllAsTouched();    
    if (this.registroForm.invalid) return;   
    this.store.dispatch(ui.isLoading());
    // Swal.fire({
    //   title: 'Espere por favor'
    // });    
    // Swal.showLoading(); 
    const {nombre, correo, password } = this.registroForm.value;
    try{
      const credenciales = await this.authService.crearUsuario(nombre, correo, password);
      this.store.dispatch(ui.stopLoading());
      this.router.navigate(['/']);
    }catch (err){
      this.store.dispatch(ui.stopLoading());
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,        
      });      
    }    
  }

  isValidControl = (name) => {
    return this.registroForm.get(name).valid;
  }

}
