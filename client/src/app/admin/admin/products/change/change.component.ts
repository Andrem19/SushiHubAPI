import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AdminService } from 'src/app/admin/admin.service';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from 'src/app/shop/shop.service';


@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss']
})
export class ChangeComponent implements OnInit {
  changeForm: FormGroup;
  formData = new FormData;
  picUrl: string;
  name: string;
  
  
  constructor(private fb: FormBuilder, private shopService: ShopService, 
     private adminService: AdminService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): any{
  this.loadProduct();
  this.createChangeForm();
  
  }
  loadProduct() {
    this.shopService.getProduct(+this.route.snapshot.paramMap.get('id')).subscribe(product => {
      this.picUrl = product.pictureUrl;
      this.name = product.name;
      this.formData.append('Id', product.id.toString());
      this.changeForm.get('Name').setValue(product.name);
      this.changeForm.get('Ingridients').setValue(product.ingridients);
      this.changeForm.get('Price').setValue(product.price);
      this.changeForm.get('Type').setValue(product.productType);
      this.changeForm.get('Popularity').setValue(product.popularity);
      this.changeForm.get('MinutesToMake').setValue(product.minutesToMake.toString());

    }, error => {
      console.log(error);
    })
    
  }

  onSubmit(): void {
    this.createFormData()
    this.adminService.updateProduct(this.formData).subscribe(response => {
      this.router.navigateByUrl('/admin/products');
    }, error => {
      console.log(error);
    })
  }

  createFormData() {
    this.formData.append('Name', this.changeForm.value.Name);
    this.formData.append('Price', this.changeForm.value.Price.toString());
    this.formData.append('Ingridients', this.changeForm.value.Ingridients);
    this.formData.append('Type', this.changeForm.value.Type);
    this.formData.append('Popularity', this.changeForm.value.Popularity);
    this.formData.append('minutesToMake', this.changeForm.value.MinutesToMake.toString());
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const _file = event.target.files[0];
      this.formData.append('File', _file);
    }
  }
  async createChangeForm() {

    this.changeForm = this.fb.group({
      Name: [''],
      Ingridients: [''],
      Price: [''],
      File: [''],
      PictureUrl: [''],
      Type: [''],
      Popularity: [''],
      MinutesToMake: ['']
    })
  }
  
}
