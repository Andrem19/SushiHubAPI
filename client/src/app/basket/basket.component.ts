import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { IAddress } from '../shared/models/address';
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDiscounts } from '../shared/models/discount';
import { IUser } from '../shared/models/user';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  public innerWidth: any;
  basket$: Observable<IBasket>;
  basketTotals$: Observable<IBasketTotals>;
  address$: Observable<IAddress>;
  currentDiscounts$: Observable<IDiscounts>;
  currentDiscounts: IDiscounts;
  discountChekBox = this.fb.group({
    discRef: false,
    acumRef: false,
  });
  discountPromo = this.fb.group({
    code1: '',
    code2: '',
    code3: ''
  })

  constructor(private basketService: BasketService, private accountService: AccountService, private fb: FormBuilder) {
  
   }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
      this.accountService.loadCurrentUser(token).subscribe(() =>{
      }, error => {
        console.log(error)
      })
    this.currentDiscounts$ = this.accountService.currentDiscounts$;
    this.basket$ = this.basketService.basket$;
    this.basketTotals$ = this.basketService.basketTotal$;
    this.innerWidth = window.innerWidth;
  }
check() {
  let promoCode: string = this.discountPromo.get('code1').value + this.discountPromo.get('code2').value + this.discountPromo.get('code3').value;
  
  if (promoCode.length === 9) {
    this.basketService.checkPromoCode(promoCode);
  }
}

  change() {
  let discount;
  if (this.discountChekBox.get('discRef').value == true && this.discountChekBox.get('acumRef').value == true) {
    discount = 2
  } else if (this.discountChekBox.get('discRef').value == false && this.discountChekBox.get('acumRef').value == false) {
    discount = 0;
  } else if (this.discountChekBox.get('discRef').value == true && this.discountChekBox.get('acumRef').value == false) {
    discount = 1;
  } else if (this.discountChekBox.get('discRef').value == false && this.discountChekBox.get('acumRef').value == true) {
    discount = 3;
  }
  this.basketService.calculateTotals(discount);
  }

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }
  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }
}
