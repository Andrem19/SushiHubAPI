import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasketComponent } from './basket.component';
import { BasketRoutingModule } from './basket-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    BasketComponent,
  ],
  providers: [
  ],
  imports: [
    CommonModule,
    BasketRoutingModule,
    SharedModule,
    FormsModule,
    MatCheckboxModule
  ]
})
export class BasketModule { }
