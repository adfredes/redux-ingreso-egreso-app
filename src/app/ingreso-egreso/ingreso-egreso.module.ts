import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { IngresosEgresosComponent } from 'src/app/ingreso-egreso/ingresos-egresos.component';
import { EstadisticaComponent } from 'src/app/ingreso-egreso/estadistica/estadistica.component';
import { DetalleComponent } from 'src/app/ingreso-egreso/detalle/detalle.component';

import { OrdenIngresoPipe } from 'src/app/pipes/orden-ingreso.pipe';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { StoreModule } from '@ngrx/store';
import { ingresoEgresoReducer } from './ingreso-egreso.reducer';


@NgModule({
  declarations: [
    DashboardComponent,
    IngresosEgresosComponent,
    EstadisticaComponent,
    DetalleComponent,    
    OrdenIngresoPipe
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature('ingresosEgresos', ingresoEgresoReducer),
    RouterModule,
    ReactiveFormsModule,
    ChartsModule,
    SharedModule,
    DashboardRoutesModule
  ]
})
export class IngresoEgresoModule { }
