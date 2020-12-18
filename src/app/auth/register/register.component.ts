import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.createForm();
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
    const {nombre, correo, password } = this.registroForm.value;
    try{
      const credenciales = await this.authService.crearUsuario(nombre, correo, password);
      console.log(credenciales);
      this.router.navigate(['/']);
    }catch (err){
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
