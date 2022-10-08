import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IPointInfo } from '../shared/models/pointInfo';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  oldPromo: string;
  shipping = 0;
  discount = 0;
  disc = 0;
  total = 0;
  subtotal = 0;

  constructor(private http: HttpClient) { }

  async getBasket() {
    const basket_id: string = localStorage.getItem("basket_id");
    if (basket_id != null) {
    await this.http.get<IBasket>(this.baseUrl + 'Basket?id=' + basket_id).subscribe((response:IBasket) => {
      this.basketSource.next(response)
      this.calculateTotals(0);
      return response;
    });
    } 
  }
  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().basket_id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
        })
      )
  }
  getCurrentBasketValue() {
    return this.basketSource.value;
  }
  getBasketTotalValue() {
    return this.basketTotalSource.value;
  }
  calculateTotals(mult: number, code?: string) {
    const basket = this.getCurrentBasketValue();
    this.subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    if (mult === 0) {
      this.disc = 1;
      this.discount = 0;
      basket.refDisc = false;
      basket.acumDisc = false;
      basket.promoDisc = '1';
    } else if (mult === 1) {
      this.disc = 0.9;
      this.discount = 10;
      basket.refDisc = true;
      basket.acumDisc = false;
      basket.promoDisc = '1';
      this.setBasketWithoutCalc(basket);
    } else if (mult === 2) {
      this.disc = 0.8;
      this.discount = 20;
      basket.refDisc = true;
      basket.acumDisc = true;
      basket.promoDisc = '1';
      this.setBasketWithoutCalc(basket);
    } else if (mult === 3) {
      this.disc = 0.9;
      this.discount = 10;
      basket.refDisc = false;
      basket.acumDisc = true;
      basket.promoDisc = '1';
      this.setBasketWithoutCalc(basket);
    } else if (mult === 4) {
      this.disc = 0.9;
      this.discount = 10;
      basket.refDisc = false;
      basket.acumDisc = false;
      basket.promoDisc = code;
      this.setBasketWithoutCalc(basket);
    }
    
    this.total = this.subtotal * this.disc;
    const shipping = "0";
    const discount = this.discount;
    const subtotal = this.subtotal;
    const total = this.total;
    const disc = this.disc;
    
    this.basketTotalSource.next({shipping, subtotal, discount, total, disc});
  }

    setShipping(point: IPointInfo, mult: number) {
    let basketT = this.getBasketTotalValue();
    let basket = this.getCurrentBasketValue();
    basket.point = point.pointNumber;
    let shipping;
      if (mult >= 4 && (basketT.shipping === "0" || basketT.shipping === "-10%")) {
        shipping = "GPB " + point.deliveryCost.toString()
        basket.deliveryMethod = point.deliveryCost;
        basket.shippingPrice = shipping;
        if (basket.refDisc && basket.acumDisc) {
          this.total = basketT.subtotal * 0.8 + point.deliveryCost;
          this.discount = 20;
         } else if (!basket.refDisc && !basket.acumDisc) {
           this.total = basketT.subtotal * 1 + point.deliveryCost;
           this.discount = 0;
           if (basket.promoDisc.length > 8) {
            this.total = basketT.subtotal * 0.9 + point.deliveryCost;
            this.discount = 10;
           }
         } else if (basket.refDisc && !basket.acumDisc) {
           this.total = basketT.subtotal * 0.9 + point.deliveryCost;
           this.discount = 10;
         } else if (!basket.refDisc && basket.acumDisc) {
           this.total = basketT.subtotal * 0.9 + point.deliveryCost;
           this.discount = 10;
         }
          const total = this.total;
          const discount = this.discount;
          const subtotal = basketT.subtotal;
          const disc = basketT.disc;

          this.setBasketWithoutCalc(basket);
          this.basketTotalSource.next({shipping, subtotal, discount, total, disc});

      } else if (mult < 1 && basketT.shipping !== "-10%") {
        basket.deliveryMethod = 1;
          if (basket.refDisc && basket.acumDisc) {
           this.total = basketT.subtotal * 0.7;
           this.discount = 30;
          } else if (!basket.refDisc && !basket.acumDisc) {
            this.total = basketT.subtotal * 0.9;
            this.discount = 10;
            if (basket.promoDisc.length > 8) {
              this.total = basketT.subtotal * 0.8;
              this.discount = 20;
             }
          } else if (basket.refDisc && !basket.acumDisc) {
            this.total = basketT.subtotal * 0.8;
            this.discount = 20;
          } else if (!basket.refDisc && basket.acumDisc) {
            this.total = basketT.subtotal * 0.8;
            this.discount = 20;
          }
        shipping = "-10%";
        basket.shippingPrice = shipping;

          const total = this.total;
          const discount = this.discount;
          const subtotal = basketT.subtotal;
          const disc = basketT.disc;
      
          this.setBasketWithoutCalc(basket);
          this.basketTotalSource.next({shipping, subtotal, discount, total, disc});
      } else if (mult === 3) {
        basket.deliveryMethod = 0;
        if (basket.refDisc && basket.acumDisc) {
          this.total = basketT.subtotal * 0.8;
          this.discount = 20;
         } else if (!basket.refDisc && !basket.acumDisc) {
           this.total = basketT.subtotal * 1;
           this.discount = 0;
           if (basket.promoDisc.length > 8) {
            this.total = basketT.subtotal * 0.9;
            this.discount = 10;
           }
         } else if (basket.refDisc && !basket.acumDisc) {
           this.total = basketT.subtotal * 0.9;
           this.discount = 10;
         } else if (!basket.refDisc && basket.acumDisc) {
           this.total = basketT.subtotal * 0.9;
           this.discount = 10;
         }

        shipping = "0";
        basket.shippingPrice = shipping;

          const total = this.total;
          const discount = this.discount;
          const subtotal = basketT.subtotal;
          const disc = basketT.disc;

          this.setBasketWithoutCalc(basket);
          this.basketTotalSource.next({shipping, subtotal, discount, total, disc});
      }
  }
  checkPromoCode(code: string){
    this.http.get(this.baseUrl + 'Discount/promocode?promo=' + code).subscribe((bool: boolean) => {
    if (bool === true) {
      this.calculateTotals(4, code);
    }
    return 0;
  });
  }

  async addItemToBasket(item: IProduct) {
    const basket = this.getCurrentBasketValue()
    const basket_id: string = localStorage.getItem("basket_id");
    if (basket_id != null) {
      const trig = basket.items.findIndex(x => x.idProd === item.id)
      if (trig === -1) {
        const basketItem: IBasketItem = this.mapProductItemToBasketItem(item, 1)
        basket.items.push(basketItem);
      } else {
        basket.items[trig].quantity++;
      }
      this.setBasket(basket);
    }
    if (basket_id == null) {
      const basket = new Basket();
      localStorage.setItem('basket_id', basket.basket_id);
      const basketItem: IBasketItem = this.mapProductItemToBasketItem(item, 1)
      basket.items.push(basketItem);
      this.newBasket(basket);
    } 
  }
  async newBasket(basket: IBasket) {
    const path: string = this.baseUrl + 'Basket';
    await this.http.post(path, basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals(0);
    });
  }
  setBasket(basket: IBasket) {
    const path: string = this.baseUrl + 'Basket';
    this.http.put(path, basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals(0);
    });
  }

  setBasketWithoutCalc(basket: IBasket) {
    const path: string = this.baseUrl + 'Basket';
    this.http.put(path, basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
    });
  }
  async incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue()
    const foundItemIndex = basket.items.findIndex(x => x.idProd === item.idProd);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket)
  }

  deleteLocalBasket(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'Basket?id=' + basket.basket_id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.log(error);
    });
  }
  async removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.idProd === item.idProd)) {
      basket.items = basket.items.filter(i => i.idProd !== item.idProd)
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket)
      }
    }
  }
  async decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.idProd === item.idProd);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket)
    } else {
      this.removeItemFromBasket(item);
    }
  }
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
    idProd: item.id,
    productName: item.name,
    price: item.price,
    pictureUrl: item.pictureUrl,
    quantity,
    type: item.productType
    }
  }
}


