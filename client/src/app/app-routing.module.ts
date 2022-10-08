import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin/admin.component';
import { ProductsComponent } from './admin/admin/products/products.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { AllordersComponent } from './admin/admin/allorders/allorders.component';
import { DashboardComponent } from './admin/admin/dashboard/dashboard.component';
import { StatisticComponent } from './admin/admin/statistic/statistic.component';
import { SquaresComponent } from './admin/admin/squares/squares.component';
import { RolesComponent } from './admin/admin/roles/roles.component';
import { OrdersmComponent } from './admin/orders/ordersm.component';
import { InfoComponent } from './admin/info/info.component';
import { ChangeComponent } from './admin/admin/products/change/change.component';
import { CreateComponent } from './admin/admin/products/create/create.component';
import { PromoCodesComponent } from './admin/admin/promo-codes/promo-codes.component';
import { ReferalPageComponent } from './referal-page/referal-page.component';
import { CategoryComponent } from './admin/admin/category/category.component';
import { AllbasketsComponent } from './admin/admin/allbaskets/allbaskets.component';
import { PolicyComponent } from './policy/policy.component';
import { SettingsComponent } from './admin/admin/settings/settings.component';

export const routes: Routes = [
  {path: '', component: HomeComponent, data: {breadcrumb: 'Home'}},
  {path: 'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test Errors'}},
  {path: 'server-error', component: ServerErrorComponent, data: {breadcrumb: 'Server Errors'}},
  {path: 'not-found', component: NotFoundComponent, data: {breadcrumb: 'Not Found'}},
  {path: 'shop', loadChildren: () => import('./shop/shop.module').then(mod => mod.ShopModule), 
  data: {breadcrumb: 'Shop'}},
  {path: 'basket', loadChildren: () => import('./basket/basket.module').then(mod => mod.BasketModule), 
  data: {breadcrumb: 'Basket'}},
  {path: 'admin', canActivate: [AuthGuard], data: {
    role: 'Admin'
  }, loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule), 
  },
  {path: 'policy', component: PolicyComponent },
  {path: 'account', loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule),
  data: {breadcrumb: {skip: true}}},
  {path: 'ordersm', canActivate: [AuthGuard], data: {role: 'Moderator'}, component: OrdersmComponent},
  {
    path: 'orders', 
    canActivateChild: [AuthGuard],
    loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule),
    data: { breadcrumb: 'Orders' }
  },
  {path: 'referals', canActivateChild: [AuthGuard], component: ReferalPageComponent},
  {path: 'info', canActivate: [AuthGuard], data: {role: 'Moderator'}, component: InfoComponent},
  {path: 'admin', canActivate: [AuthGuard], data: {role: 'Admin'}, component: AdminComponent, 
  children: [
  { path: 'products', component:  ProductsComponent },
  { path: 'products/change/:id', component:  ChangeComponent },
  { path: 'products/create', component:  CreateComponent },
  { path: 'allorders', component: AllordersComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'allbaskets', component: AllbasketsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'statistic', component:  StatisticComponent },
  { path: 'squares', component: SquaresComponent },
  { path: 'promoCodes', component: PromoCodesComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'settings', component: SettingsComponent }
]},
  {path: 'checkout',
  canActivateChild: [AuthGuard],
  loadChildren: () => import('./checkout/checkout.module').then(mod => mod.CheckoutModule), 
  data: {breadcrumb: 'Checkout'}},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
