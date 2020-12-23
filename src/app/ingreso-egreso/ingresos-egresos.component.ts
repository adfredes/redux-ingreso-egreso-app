import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as uiAction from '../shared/ui.actions';
import { AppStateWithIngreso } from './ingreso-egreso.reducer';

@Component({
  selector: 'app-ingresos-egresos',
  templateUrl: './ingresos-egresos.component.html',
  styles: [
  ]
})
export class IngresosEgresosComponent implements OnInit, OnDestroy {
  
  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  uiSubscription: Subscription;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppStateWithIngreso>) { }
  
  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.createForm();
    this.uiSubscription = this.store.select('ui').subscribe(({isLoading}) => this.loading = isLoading);    
  }

  createForm = () => this.ingresoForm = this.fb.group({
    descripcion: ['', Validators.required],
    monto: ['', Validators.required]
  });

  guardar = async () => {        
    this.ingresoForm.markAllAsTouched();
    if (this.ingresoForm.invalid) { return; }

    this.store.dispatch(uiAction.isLoading());
    
    const {descripcion, monto} = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    try{
      await this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso);
      this.store.dispatch(uiAction.stopLoading());
      this.ingresoForm.reset();
      this.tipo = 'ingreso';
      Swal.fire('Registro creado', descripcion, 'success');
    }catch(err){
      this.store.dispatch(uiAction.stopLoading());
      Swal.fire('Error', err.message, 'error');      
    }
    

  }

}
