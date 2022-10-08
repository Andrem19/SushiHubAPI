import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBasket } from '../shared/models/basket';
import { ICategory } from '../shared/models/category';
import { IProduct } from '../shared/models/product';
import { IPromoCode } from '../shared/models/promoCode';
import { ISquare } from '../shared/models/squares';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;
  private productSourse = new BehaviorSubject<IProduct[]>(null);
  products$ = this.productSourse.asObservable();
  private userSourse = new BehaviorSubject<IUser>(null);
  user$ = this.userSourse.asObservable();
  private squaresSourse = new BehaviorSubject<ISquare[]>(null);
  squares$ = this.squaresSourse.asObservable();
  private promoCodeSourse = new BehaviorSubject<IPromoCode[]>(null);
  promoCodes$ = this.promoCodeSourse.asObservable();
  private categorySourse = new BehaviorSubject<ICategory[]>(null);
  category$ = this.categorySourse.asObservable();
  private allBasketsSourse = new BehaviorSubject<IBasket[]>(null);
  allBaskets$ = this.allBasketsSourse.asObservable();
  constructor(private http: HttpClient) { }


  updateProduct(values: any) {
    return this.http.put(this.baseUrl + 'Product', values);
  }
  createProduct(values: any) {
    return this.http.post(this.baseUrl + 'Product', values);
  }
  deleteProduct(id: any) {
    return this.http.delete(this.baseUrl + 'Product/' + id);
  } 
  deleteCategory(id: any) {
    return this.http.delete(this.baseUrl + 'Product/category?id=' + id);
  } 
  createCategory(values: any) {
    return this.http.post(this.baseUrl + 'Product/category', values);
  }
  getRxProducts() {
    this.http.get<IProduct[]>(this.baseUrl + 'product/getallproducts')
    .subscribe((prod: IProduct[])=> {
      this.productSourse.next(prod);
  })
}
getBaskets() {
  this.http.get<IBasket[]>(this.baseUrl + 'basket/getallbaskets')
  .subscribe((bas: IBasket[])=> {
    this.allBasketsSourse.next(bas);
  })
}
getCategorys() {
  this.http.get<ICategory[]>(this.baseUrl + 'product/category')
  .subscribe((cat: ICategory[])=> {
    this.categorySourse.next(cat);
})
}
getUserFromEmail(email: string) {
    return this.http.get<IUser>(this.baseUrl + 'Account/getUserByEmail?email=' + email)
    .subscribe((user: IUser)=> {
      this.userSourse.next(user);
  })
}

getCurrentUserValue() {
  return this.userSourse.value;
}
getCurrentSquaresValue() {
  return this.squaresSourse.value;
}
dleteUserByEmail(email: string) {
  return this.http.delete(this.baseUrl + 'Account/delete?email=' + email)
  .subscribe((resp) => {
    console.log(resp)
  })
}
addRole(email: string, role: string) {
  return this.http.put(this.baseUrl + 'Account/addrole?email=' + email + "&role="+ role, null)
  .subscribe((resp) => {
    console.log(resp)
  })
}
addTelegramChatId(email: string, chatId: string) {
  return this.http.put(this.baseUrl + 'Account/addChatId?email=' + email + "&chatId="+ chatId, null)
  .subscribe((resp) => {
  })
}
removeRole(email: string, role: string) {
  return this.http.put(this.baseUrl + 'Account/removerole?email=' + email + "&role="+ role, null)
  .subscribe((resp) => {
    console.log(resp)
  })
}
addPoint(email: string, point: string) {
    let path: string = this.baseUrl + 'Account/addpoint?email=' + email + "&point="+ point;
  return this.http.put(path, null)
  .subscribe((resp) => {
    console.log(resp)
  })
}
getAllSquares() {
  return this.http.get(this.baseUrl + "Map/getsquares")
  .subscribe((resp: ISquare[]) => {
    this.squaresSourse.next(resp);
  })
}
deleteSquare(id: string) {
  return this.http.delete(this.baseUrl + 'Map/deletesquare?id=' + id)
  .subscribe((resp) => {
    console.log(resp)
  })
}
addSquare(square: ISquare) {
this.http.post(this.baseUrl + "Map/setsquare", square).subscribe((resp: ISquare) => {
  console.log(resp)
})
}
getAllPromoCodes() {
  this.http.get(this.baseUrl + "Discount/getall").subscribe((resp: IPromoCode[]) => {
    this.promoCodeSourse.next(resp);
  })
}
changePassword(email: string, newPassword:string) {
  this.http.get(this.baseUrl + "Account/password?email="+email+"&newPassword="+newPassword).subscribe((resp: IUser) => {
    console.log(resp)
  })
}
createNewPromo(codes: string, date: string, status: string) {
  var codesList = codes.split(',');
  // var validTo = date.split('.');
  var body = {promo: codesList,
              date: date,
              status: status}
  this.http.post(this.baseUrl + "Discount/promocode", body).subscribe((resp: IPromoCode[]) => {
    this.promoCodeSourse.next(resp);
  })
}
removePromoCode(code: string) {
  this.http.delete(this.baseUrl + "Discount/promocode?promo=" + code).subscribe((resp: IPromoCode[]) => {
    this.promoCodeSourse.next(resp);
  });
}
}