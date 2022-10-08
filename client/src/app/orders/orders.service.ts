import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getOrdersForUser() {
    return this.http.get(this.baseUrl + 'orders');
  }
  getOrdersByPoint() {
    return this.http.get(this.baseUrl + 'orders/point');
  }
  getAllOrders(fromDate: NgbDate, toDate: NgbDate, point: string) {
    const date = {
      From: fromDate,
      To: toDate
    }
  let p = '';
  if (point != '') {
    p = "?point="+point;
  }
    return this.http.post(this.baseUrl + 'orders/all' + p, date);
  }
  getOrderDetailed(id: number) {
    return this.http.get(this.baseUrl + 'orders/' + id);
  }
  OrderReady(id: string) {
    return this.http.get(this.baseUrl + 'Notification/orderReady?id=' + id);
  }
}