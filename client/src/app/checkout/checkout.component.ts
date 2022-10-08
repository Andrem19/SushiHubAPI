import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotals } from '../shared/models/basket';
import { IPointInfo } from '../shared/models/pointInfo';
import { CheckoutService } from './checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  basketTotals$: Observable<IBasketTotals>;
  pointInfo$: Observable<IPointInfo>;
  public innerWidth: any;

  constructor(private checkoutService: CheckoutService, private fb: FormBuilder, private accountService: AccountService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.basketTotals$ = this.basketService.basketTotal$;
    this.pointInfo$ = this.checkoutService.point$;
    this.innerWidth = window.innerWidth;
  }

  createCheckoutForm() {
    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        name: [null, Validators.required],
        numberOfHouse: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        postCode: [null, Validators.required],
        telephoneNumber: [null, Validators.required],
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    })
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe(address => {
      if (address) {
        this.checkoutForm.get('addressForm').patchValue(address);
      }
    }, error => {
      console.log(error);
    })
  }

}