import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Observable } from 'rxjs';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { map } from 'rxjs/operators';
import { IngresoEgresoService } from '../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit {

  ingresosEgresos$: Observable<IngresoEgreso[]>;

  constructor(private store: Store<AppState>, private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosEgresos$ = this.store.select('ingresosEgresos').pipe(map(({items})=> items));
  }

  borrar = async(uid: string) => {
    try{
      await this.ingresoEgresoService.borrarIngresoEgreso(uid);
      Swal.fire('Borrado', 'Item Borrado', 'success');
    }catch(err){
      Swal.fire('Error', err.messagge, 'error');
    }
  };

}
