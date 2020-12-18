import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup = () : void => {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  login = async () => {
    this.loginForm.markAllAsTouched();
    if(this.loginForm.invalid) { return; }    
    Swal.fire({
      title: 'Espere por favor'
    });    
    Swal.showLoading();
    const {correo, password} = this.loginForm.value;

    try {            
      const credenciales = await this.authService.loginUsuario(correo, password);
      Swal.close();
      console.log(credenciales);
      this.router.navigate(['/']);      
    } catch (err) {      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,        
      })      
    }
  }

}
