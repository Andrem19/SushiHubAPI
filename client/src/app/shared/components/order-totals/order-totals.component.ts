import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketTotals } from '../../models/basket';

@Component({
  selector: 'app-order-totals',
  templateUrl: './order-totals.component.html',
  styleUrls: ['./order-totals.component.scss']
})
export class OrderTotalsComponent implements OnInit {
  @Input() shippingPrice: string;
  @Input() subtotal: number;
  @Input() total: number;
  @Input() discount: number;
  active: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.containOrderUrl();
  }
  containOrderUrl() {
    if (this.router.url.indexOf('/order') > -1) {
      this.active = 0;
    } else {
      this.active = 1;
    }
  }
}
