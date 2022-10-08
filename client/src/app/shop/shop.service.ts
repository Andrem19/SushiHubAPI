import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brands';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators'
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    if (shopParams.types) {
      params = params.append('Types', shopParams.types);
    }
    if (shopParams.SearchTerm) {
      params = params.append('SearchTerm', shopParams.SearchTerm);
    }

    params = params.append('orderBy', shopParams.orderBy);
    params = params.append('pageNumber', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.http.get<IPagination>(this.baseUrl + 'product', {observe: 'response', params})
      .pipe(
        map(response => {
          return response.body;
        })
      )
  }
  getProduct(id: number) {
    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }
  getTypes() {
    return this.http.get<IType[]>(this.baseUrl + 'product/types');
  }
}
