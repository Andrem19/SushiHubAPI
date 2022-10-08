import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IOrderToCreate } from '../shared/models/order';
import { IPointInfo } from '../shared/models/pointInfo';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;
  private pointSource = new BehaviorSubject<IPointInfo>(null);
  point$ = this.pointSource.asObservable();

  constructor(private http: HttpClient) { }

  createOrder(order: IOrderToCreate) {
    return this.http.post(this.baseUrl + 'orders', order);
  }

  getPointInfo() {
    return this.pointSource.value;
  }
  checkLocation(address: IAddress) {
    return this.http.put<IPointInfo>(this.baseUrl + 'Map/where', address).subscribe(
      (pointInfo: IPointInfo) => {
        this.pointSource.next(pointInfo)
      }
    );
  }

  newOrderCreated(paymentIntentId: string) {
    return this.http.get(this.baseUrl + 'Notification?paymentId=' + paymentIntentId).subscribe(
      (resp) => {
        var r = resp;
      }
    );
  }
}