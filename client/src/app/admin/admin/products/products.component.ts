import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IProduct } from 'src/app/shared/models/product';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$: Observable<IProduct[]>

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getRxProducts()
    this.products$ = this.adminService.products$;
  }

  async removeProduct(product: IProduct) {
   await this.adminService.deleteProduct(product.id).subscribe((resp) => {
      this.adminService.getRxProducts();
    }), error => {
      console.log(error)
    }
  }
}
