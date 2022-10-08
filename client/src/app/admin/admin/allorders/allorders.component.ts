import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/orders/orders.service';
import { IOrder } from 'src/app/shared/models/order';
import {NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerNavigateEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss']
})
export class AllordersComponent implements OnInit {
  orders: IOrder[];

  point: string = '';
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  constructor(private orderService: OrdersService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) { 
    let startDate = calendar.getToday();
    if (startDate.month != 1) {
      startDate.month -= 1;
      startDate.day = 1;
    } else {
      startDate.month = 12;
      startDate.year -=1;
      startDate.day = 1;
    }
    this.fromDate = startDate;
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 30);
  }

  ngOnInit(): void {
    this.getOrders()
  }
  getOrders() {
    this.orderService.getAllOrders(this.fromDate, this.toDate, this.point).subscribe((orders: IOrder[]) => {
      this.orders = orders;
    }, error => {
      console.log(error);
    })
  }
  pointChange() {
    if (this.fromDate != null && this.toDate != null) {
      this.getOrders();
    }
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate != null && this.toDate != null) {
      this.getOrders();
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
}

