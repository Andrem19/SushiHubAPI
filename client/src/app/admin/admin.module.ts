import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ProductsComponent } from './admin/products/products.component';
import { OrdersmComponent } from './orders/ordersm.component';
import { InfoComponent } from './info/info.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AllordersComponent } from './admin/allorders/allorders.component';
import { SquaresComponent } from './admin/squares/squares.component';
import { RolesComponent } from './admin/roles/roles.component';
import { StatisticComponent } from './admin/statistic/statistic.component';
import { ChangeComponent } from './admin/products/change/change.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from './admin/products/create/create.component';
import { PromoCodesComponent } from './admin/promo-codes/promo-codes.component';
import { CategoryComponent } from './admin/category/category.component';
import { AllbasketsComponent } from './admin/allbaskets/allbaskets.component';
import { SharedModule } from '../shared/shared.module';
import { SettingsComponent } from './admin/settings/settings.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AdminComponent,
    ProductsComponent,
    OrdersmComponent,
    InfoComponent,
    DashboardComponent,
    AllordersComponent,
    SquaresComponent,
    RolesComponent,
    StatisticComponent,
    ChangeComponent,
    CreateComponent,
    PromoCodesComponent,
    CategoryComponent,
    AllbasketsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgbDatepickerModule
  ]
})
export class AdminModule { }
