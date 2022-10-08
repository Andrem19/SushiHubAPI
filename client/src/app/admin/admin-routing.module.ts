import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { OrderDetailedComponent } from '../orders/order-detailed/order-detailed.component';
import { OrdersComponent } from '../orders/orders.component';
import { ChangeComponent } from './admin/products/change/change.component';
import { ProductsComponent } from './admin/products/products.component';

const routes: Routes = [
  {path: 'allorders/', component: OrdersComponent},
  {path: 'allorders/:id', component: OrderDetailedComponent}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
