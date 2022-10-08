import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/models/address';
import { IOrder } from 'src/app/shared/models/order';
import { IUser } from 'src/app/shared/models/user';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order: IOrder;
  currentRole$: Observable<string>;
  DeleiveryMethod: string;
  disabled: boolean;

  constructor(private route: ActivatedRoute, private breadcrumbService: BreadcrumbService, 
    private orderService: OrdersService, private accountService: AccountService) {
      this.breadcrumbService.set('@OrderDetailed', ' ');
     }


  ngOnInit(): void {
    this.currentRole$ = this.accountService.currentRole$;
    this.orderService.getOrderDetailed(+this.route.snapshot.paramMap.get('id'))
      .subscribe((order: IOrder) => {
        this.order = order;
        this.disabled = order.readyToPickUp;
        if (order.deliveryMethod == 0) {
          this.DeleiveryMethod = "Free Delivery"
        } else if (order.deliveryMethod == 1) {
          this.DeleiveryMethod = "Costumer will pick it up"
        } else if (order.deliveryMethod > 1) {
          this.DeleiveryMethod = `Delivery cost: ${this.DeleiveryMethod}`
        }
        this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
      }, error => {
        console.log(error);
      })
  }
  OrderReady(id: number) {
    this.orderService.OrderReady(id.toString()).subscribe((order: IOrder) => {
      this.disabled = order.readyToPickUp;
    }, error => {
      console.log(error);
    });
  }
}
