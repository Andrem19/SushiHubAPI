import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IAddress } from 'src/app/shared/models/address';
import { IPointInfo } from 'src/app/shared/models/pointInfo';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  pointInfo$: Observable<IPointInfo>;

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.pointInfo$ = this.checkoutService.point$;
  }

  setShippingPrice(mult: number) {
    this.basketService.setShipping(this.checkoutService.getPointInfo(), mult);
  }

}