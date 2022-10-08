import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/account/account.service';
import { AuthService } from 'src/app/orders/auth.service';
import { OrdersService } from 'src/app/orders/orders.service';
import { SignalRService } from 'src/app/orders/signal-r.service';
import { IOrder } from 'src/app/shared/models/order';
import {Howl, Howler} from 'howler';

@Component({
  selector: 'app-orders',
  templateUrl: './ordersm.component.html',
  styleUrls: ['./ordersm.component.scss']
})
export class OrdersmComponent implements OnInit {
  orders: IOrder[];

  constructor(private accountService: AccountService, private orderService: OrdersService, public signalrService: SignalRService, public authService: AuthService) { }

  ngOnInit(): void {
    this.getOrders();
    
  }
  ngOnDestroy(): void {
  }

  getOrders() {
    this.orderService.getOrdersByPoint().subscribe((orders: IOrder[]) => {
      this.orders = orders;
    }, error => {
      console.log(error);
    })
  }
}
