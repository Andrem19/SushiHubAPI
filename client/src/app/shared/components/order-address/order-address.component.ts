import { Component, Input, OnInit } from '@angular/core';
import { IAddress } from '../../models/address';

@Component({
  selector: 'app-order-address',
  templateUrl: './order-address.component.html',
  styleUrls: ['./order-address.component.scss']
})
export class OrderAddressComponent implements OnInit {
@Input() address: IAddress;
  constructor() { }

  ngOnInit(): void {
  }

}
